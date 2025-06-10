import {CanActivate, Router} from '@angular/router';
import {AuthenticationService} from "../services/auth.service";
import {Injectable} from "@angular/core";
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}


  canActivate(): boolean {
    if (this.authService.isAdmin() || 
        this.authService.isTechnicien() || 
        this.authService.isVerificateur() || 
        this.authService.isRedacteur()) {
      return true;
    }
    
    this.router.navigate(['/auth/login']);
    return false;
  }
}
