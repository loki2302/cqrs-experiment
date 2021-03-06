import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {UserAlreadyRegisteredApiError} from "./user-already-registered-api-error";
import {UnknownApiError} from "./unknown-api-error";
import {UserNotRegisteredApiError} from "./user-not-registered-api-error";

@Injectable()
export class AuthenticationService {
    isAuthenticated: boolean = false;

    constructor(private http: Http) {
    }

    async init(): Promise<void> {
        try {
            await this.http.get('/api/me').toPromise();
            this.isAuthenticated = true;
        } catch(e) {
            this.isAuthenticated = false;
        }
    }

    async signUp(credentials: { username: string }): Promise<void> {
        try {
            await this.http.post('/api/users', {
                username: credentials.username
            }).toPromise();
        } catch(e) {
            if(e instanceof Response) {
                const response = <Response>e;
                if(response.status == 400) {
                    throw new UserAlreadyRegisteredApiError();
                } else {
                    throw new UnknownApiError();
                }
            }
        }
    }

    async signIn(credentials: { username: string }): Promise<void> {
        try {
            await this.http.post('/api/sign-in', {
                username: credentials.username
            }).toPromise();
            this.isAuthenticated = true;
        } catch(e) {
            if(e instanceof Response) {
                const response = <Response>e;
                if(response.status == 400) {
                    throw new UserNotRegisteredApiError();
                } else {
                    throw new UnknownApiError();
                }
            }
        }
    }

    async signOut(): Promise<void> {
        try {
            await this.http.post('/api/sign-out', {}).toPromise();
        } finally {
            this.isAuthenticated = false;
        }
    }
}
