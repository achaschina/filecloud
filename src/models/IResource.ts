export interface ShareInfo {
    is_root: boolean;
    is_owned: boolean;
    rights: string;
}

export interface Exif {
    date_time: string;
}

export interface CommentIds {
    private_resource: string;
    public_resource: string;
}

export interface ResourceList {
    sort: string;
    items: Resource[];
    limit: number;
    offset: number;
    path: string;
    total: number;
}

// Модель данных, возвращаемых методом https://cloud-api.yandex.net:443/v1/disk/resources?path=
export interface Resource {
    antivirus_status: undefined;
    resource_id: string;
    share: ShareInfo;
    file: string;
    size: number;
    _embedded: ResourceList;
    exif: Exif;
    custom_properties: object;
    media_type: string;
    sha256: string;
    type: string;
    mime_type: string;
    revision: number;
    public_url: string;
    path: string;
    md5: string;
    public_key: string;
    preview: string;
    name: string;
    created: string;
    modified: string;
    comment_ids: CommentIds;
}
