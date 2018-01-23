export interface MatrixResponse<T, P = {}> {
    data: T;
    msg: string;
    status: string;
    paramData: P;
    time: string;
}

// User
export interface LoginQueryResult extends MatrixResponse<{}> {
    status: 'OK' | 'NOT_AUTHORIZED';
}

export interface LoginBody {
    username: string;
    password: string;
    captcha?: string;
}

export interface LoginErrorData {
    captcha?: boolean;
}

export interface LoginSuccessData {
    realname: string;
}

export interface LoginResult extends MatrixResponse<LoginErrorData | LoginSuccessData> {
    status: 'WRONG_PASSWORD' | 'WRONG_CAPTCHA' | 'OK';
}

// Profile
export interface UpdateProfileBody {
    email?: string | null;
    phone?: string | null;
    homepage?: string | null;
    nickname?: string | null;
}

export interface Profile {
    email: string;
    homepage: string | null;
    is_valid: number;
    nickname: string;
    phone: string;
    realname: string;
    user_addition: null | object;
    user_id: number;
}
