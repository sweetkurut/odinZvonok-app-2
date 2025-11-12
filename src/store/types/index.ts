export interface Pageable {
    paged: boolean;
    unpaged: boolean;
    pageNumber: number;
    pageSize: number;
    offset: number;
    sort: Sort[];
}

export interface Sort {
    direction: string;
    nullHandling: string;
    ascending: boolean;
    property: string;
    ignoreCase: boolean;
}

export interface User {
    id: string;
    fullName: string;
    profile_photo_url: string;
}

export interface ServiceRequest {
    id: string;
    category: string;
    title: string;
    description: string;
    address: string;
    status: "PENDING_ASSIGNMENT" | string;
    imageUrls: string[];
    client: User;
    master: User;
    created_at: string;
    completed_at: string;
}

export interface Orders {
    totalPages: number;
    totalElements: number;
    pageable: Pageable;
    numberOfElements: number;
    size: number;
    content: ServiceRequest[];
    number: number;
    sort: Sort[];
    first: boolean;
    last: boolean;
    empty: boolean;
}
