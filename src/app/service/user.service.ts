import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpPersonService } from './http-person.service';

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    genero?: string | null;
    peso?: number | null;
    data_nascimento?: string | null;
    altura?: number | null;
    avatar?: string | null;
    nivel_atividade?: string | null;
    objetivo?: string | null;
}

export interface UpdateUserPayload {
    name: string;
    email: string;
    genero?: string | null;
    peso?: number | null;
    data_nascimento?: string | null;
    altura?: number | null;
    nivel_atividade?: string | null;
    objetivo?: string | null;
    avatar?: File | null;
}

const USER_ID_KEY = 'vitality_user_id';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private readonly http: HttpPersonService) {}

    // ─── Persistência de ID de sessão ────────────────────────────────────────

    saveUserId(id: number): void {
        localStorage.setItem(USER_ID_KEY, String(id));
    }

    getStoredUserId(): number | null {
        const raw = localStorage.getItem(USER_ID_KEY);
        return raw ? Number(raw) : null;
    }

    clearUserId(): void {
        localStorage.removeItem(USER_ID_KEY);
    }

    // ─── API ──────────────────────────────────────────────────────────────────

    getById(id: number): Observable<UserProfile> {
        return this.http.get<any>(`api/user/${id}`).pipe(
            map((res: any) => (res?.data ?? res) as UserProfile),
            catchError(err =>
                throwError(() => new Error(err?.error?.message ?? 'Erro ao buscar dados do usuário.'))
            )
        );
    }

    /**
     * Atualiza o perfil do usuário.
     * Usa POST + _method=PUT porque PHP/Laravel não parseia multipart via PUT nativo.
     */
    update(id: number, payload: UpdateUserPayload): Observable<UserProfile> {
        const formData = this.buildFormData(payload);
        return this.http.post<any>(`api/atualizar-user/${id}`, formData).pipe(
            map((res: any) => (res?.data ?? res) as UserProfile),
            catchError(err =>
                throwError(() => new Error(err?.error?.message ?? 'Erro ao atualizar perfil.'))
            )
        );
    }

    // ─── Privado ──────────────────────────────────────────────────────────────

    private buildFormData(payload: UpdateUserPayload): FormData {
        const fd = new FormData();
        fd.append('_method', 'PUT');        // Laravel method spoofing
        fd.append('name', payload.name);
        fd.append('email', payload.email);

        if (payload.genero != null)          fd.append('genero', String(payload.genero));
        if (payload.peso != null)            fd.append('peso', String(payload.peso));
        if (payload.altura != null)          fd.append('altura', String(payload.altura));
        if (payload.data_nascimento != null) fd.append('data_nascimento', String(payload.data_nascimento));
        if (payload.nivel_atividade != null) fd.append('nivel_atividade', payload.nivel_atividade);
        if (payload.objetivo != null)        fd.append('objetivo', payload.objetivo);
        if (payload.avatar instanceof File)  fd.append('avatar', payload.avatar, payload.avatar.name);

        return fd;
    }
}
