import { CollectionViewer, SelectionChange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import {Resource, ResourceList} from '../../models/IResource';

/** Flat node with expandable and level information */
export class DynamicFlatNode {
  constructor(public item: string, public level = 1, public expandable = false,
              public isLoading = false) {}
}

/**
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 */
export class DynamicDatabase {
  dataMap = new Map<string, string[]>();

  rootLevelNodes: string[] = [];

  /** Initial data from database */
  initialData(rootLevelNodes: string[], dataMap: Map<string, string[]>): DynamicFlatNode[] {
    this.rootLevelNodes = rootLevelNodes;
    this.dataMap = dataMap;
    return this.rootLevelNodes.map(name => new DynamicFlatNode(name, 0, true));
  }

  addNode(path: string, items: string[]) {
    this.dataMap.set(path, items);
  }

  getChildren(node: string): string[] | undefined {
    return this.dataMap.get(node);
  }

  isExpandable(node: string): boolean {
    return this.dataMap.has(node);
  }
}
/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class DynamicDataSource {

  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

  get data(): DynamicFlatNode[] { return this.dataChange.value; }
  set data(value: DynamicFlatNode[]) {
    this.treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(private treeControl: FlatTreeControl<DynamicFlatNode>,
              private database: DynamicDatabase) {}

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this.treeControl.expansionModel.onChange!.subscribe(change => {
      if ((change as SelectionChange<DynamicFlatNode>).added ||
        (change as SelectionChange<DynamicFlatNode>).removed) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
    }
  }

   /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: DynamicFlatNode, expand: boolean) {
    const children = this.database.getChildren(node.item);
    const index = this.data.indexOf(node);
    if (!children || index < 0) { // If no children, or cannot find the node, no op
      return;
    }

    node.isLoading = true;

    setTimeout(() => {
      if (expand) {
        const nodes = children.map(name =>
          new DynamicFlatNode(name, node.level + 1, this.database.isExpandable(name)));
        this.data.splice(index + 1, 0, ...nodes);
      } else {
        let count = 0;
        for (let i = index + 1; i < this.data.length
        && this.data[i].level > node.level; i++, count++) {}
        this.data.splice(index + 1, count);
      }

      // notify the change
      this.dataChange.next(this.data);
      node.isLoading = false;
    }, 1000);
  }
}

/**
 * @title Tree with dynamic data
 */
@Component({
  selector: 'app-dir-tree',
  templateUrl: 'dir-tree-view.component.html',
  styleUrls: ['dir-tree-view.component.css'],
  providers: [DynamicDatabase]
})
export class DirTreeViewComponent implements OnInit {
  constructor(private database: DynamicDatabase,
              private apiService: ApiService) {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, database);

  }

  private resources: Resource;

  treeControl: FlatTreeControl<DynamicFlatNode>;

  dataSource: DynamicDataSource;

  dataMap = new Map<string, string[]>();

  rootLevelNodes: string[] = [];

  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

  dirMapping(path: string, list: ResourceList) {
    if (this.dataMap.get(path)) { return; }
    let str: string[] = [];
    for (const item of list.items) {
      if (item.type === 'dir') {
        str = this.dataMap.get(path);
        if (!str) { str = []; }
        str.push(item.path);
        this.dataMap.set(path, str);
      }
    }
  }

  ngOnInit() {
    this.apiService.getResource('/', '&sort=name')
      .subscribe((data: Resource) => {
        this.resources = { ... data };
        this.rootLevelNodes.push(this.resources.path);
        console.log(this.rootLevelNodes);
        console.log(this.resources);
        this.dirMapping(this.resources.path, this.resources._embedded);
        this.dataSource.data = this.database.initialData(this.rootLevelNodes, new Map<string, string[]>(this.dataMap));
        console.log(this.dataMap);

        for (const item of this.dataMap.get(this.resources.path)) {
          this.updateData(item);
        }

      });
  }


  updateData(path: string) {
    this.apiService.getResource(path, '&sort=name')
      .subscribe((data: Resource) => {
        this.resources = { ... data };
        this.dirMapping(this.resources.path, this.resources._embedded);
        this.database.addNode(path, this.dataMap.get(path));

        for (const item of this.dataMap.get(this.resources.path)) {
          this.updateData(item);
        }
      });
  }

  // Обрезать имя папки
  getName(item: any) {
    const name: string[] = item.toString().split('/');
    return name[name.length - 1];
  }

  // Вывод в консоль отладочной информации
  log(info: any) {
    console.log(info);
  }
}
