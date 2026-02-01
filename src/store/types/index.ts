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

// Пагинированный ответ от /api/orders/my
export interface OrdersResponse {
    content: Order[]; // ← массив заказов
    totalPages: number;
    totalElements: number;
    pageable: {
        pageNumber: number;
        pageSize: number;
        paged: boolean;
        unpaged: boolean;
        offset: number;
        sort: SortItem[];
    };
    numberOfElements: number;
    size: number;
    number: number;
    sort: SortItem[];
    first: boolean;
    last: boolean;
    empty: boolean;
}

interface SortItem {
    direction: string;
    nullHandling: string;
    ascending: boolean;
    property: string;
    ignoreCase: boolean;
}

// Один заказ
export interface Order {
    id: string;
    category: string;
    title: string;
    description: string;
    address: string;
    status: string;
    imageUrls: string[];
    client: {
        id: string;
        fullName: string;
        profile_photo_url: string;
    };
    master?: {
        // может быть null
        id: string;
        fullName: string;
        profile_photo_url: string;
    };
    created_at: string; // ISO дата
    completed_at?: string; // может быть null
    // price?: number;          // если есть цена — добавь
}

export interface CreateOrder {
    category: string;
    title: string;
    description: string;
    address: string;
    imageUrls: string[];
}

// регистрация пользователя
// JWT
export interface ITokens {
    access_token: string;
    refresh_token: string;
}

// User
export interface IUser {
    id: number;
    telegram_id: number;
    username?: string;
    role: "CLIENT" | "OPERATOR" | "MASTER";
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    phone_number?: string;
    email?: string;
    address?: string;
    profile_photo_url?: string;
    full_name?: string;
    is_registration_complete: boolean;
}

// Responses
export interface ITelegramAuthResponse extends ITokens {
    user: IUser;
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IAuthMeResponse extends IUser {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IRefreshTokenResponse extends ITokens {}

// Requests
export interface ITelegramAuthRequest {
    init_data: string;
}

export interface IQuickRegisterRequest {
    telegram_id: number;
    username?: string;
}

export interface IFullRegisterRequest {
    telegram_id: number;
    username?: string;
    first_name: string;
    last_name: string;
    middle_name?: string;
    phone_number: string;
    email: string;
    address?: string;
    profile_photo_url?: string;
}

export interface IUpdateProfileRequest {
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    phone_number?: string;
    email?: string;
    address?: string;
    profile_photo_url?: string;
}

// тарифы
export interface Tariff {
    id: string;
    name: string;
    description: string;
    price: string;
    billingPeriod: string;
    features: string[];
    active: boolean;
}

// мастеры
export type Master = {
    id: string;
    fullName: string;
    rating: number;
    categories: string[];
    status: "AVAILABLE" | "busy";
    specializations?: string[];
    profile_photo_url?: string;
};

export type MasterStatus = "AVAILABLE" | "ON_CALL" | "ON_BREAK" | "LAST_CALL";

export type MasterProfile = {
    id: string;
    fullName: string;
    bio: string;
    experienceYears: number;
    specializations: string[];
    status: MasterStatus;
    rating: number;
    dealsCount: number;
    profile_photo_url?: string | null;
};

export interface MasterHomeView extends MasterProfile {
    completedOrdersCount?: number;
    reviewCount?: number;
}

export type DealStatus = "on_way" | "in_progress" | "completed";

export type Deal = {
    id: string;
    category: string;
    clientName: string;
    clientAddress: string;
    price: number;
    date: string;
    rating: number;
};

export type DealDetails = Deal & {
    description: string;
    photos: string[];
    review?: string;
};
