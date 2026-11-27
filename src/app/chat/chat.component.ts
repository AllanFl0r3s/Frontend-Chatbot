import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ChatApiService } from './chat-api.service';
import { EMPTY, concatMap, defer, finalize, tap } from 'rxjs';

type Msg = { from: 'user' | 'bot'; text: string; at: Date };

@Component({
  standalone: true,
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollRef') scrollRef!: ElementRef<HTMLDivElement>;

  messages = signal<Msg[]>([
    {
      from: 'bot',
      text: 'Hola. Soy tu Bot 🤖 de asistencia Istmania en que puedo ayudarte?',
      at: new Date(),
    },
  ]);

  input = '';
  sending = signal(false);
  error = signal<string | null>(null);

  menuIndex: number | null = null;
  private pressTimer: any;

  showCompanyProfile = signal(false);
  isAdmin = false;
  isEditingCompanyProfile = false;

  companyInfo = {
    nombre: '',
    telefono: '',
    whatsapp: '',
    correo: '',
    direccion1: '',
    direccion2: '',
    horario: '',
    imagen: '',
  };

  editableCompanyInfo = {
    nombre: '',
    telefono: '',
    whatsapp: '',
    correo: '',
    direccion1: '',
    direccion2: '',
    horario: '',
    imagen: '',
  };

  constructor(
    readonly auth: AuthService,
    private api: ChatApiService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const rawUser = localStorage.getItem('manda_user');

      if (rawUser) {
        try {
          const user = JSON.parse(rawUser);
          this.isAdmin = Number(user?.roleId) === 1;
        } catch {
          this.isAdmin = false;
        }
      }
    }

    this.api.getPerfil().subscribe({
      next: (data) => {
        this.companyInfo = {
          nombre: data?.Nombre ?? '',
          telefono: data?.Telefono ?? '',
          whatsapp: data?.WhatsApp ?? '',
          correo: data?.Correo ?? '',
          direccion1: data?.Direccion1 ?? '',
          direccion2: data?.Direccion2 ?? '',
          horario: data?.Horario ?? '',
          imagen: data?.Imagen ?? '',
        };
      },
      error: () => {
        console.error('No se pudo cargar el perfil');
      },
    });
  }

  quick(text: string): void {
    if (this.sending()) return;
    this.input = text;
    this.send();
  }

  viewWallet(): void {
    if (this.sending()) return;
    this.error.set(null);
    this.sending.set(true);
    const send = (text: string) => defer(() => {
      this.messages.update(messages => [...messages, { from: 'user', text, at: new Date() }]);
      return this.api.sendMessage(text).pipe(tap(reply => {
        const texts = [reply.reply, reply.followUp].filter((text): text is string => !!text);
        this.messages.update(messages => [...messages, ...texts.map(text => ({ from: 'bot' as const, text, at: new Date() }))]);
        this.scrollToBottom();
      }));
    });
    send('menu').pipe(
      concatMap(() => send('7')),
      // Una denegación se conserva en pantalla y no dispara otra opción del menú.
      concatMap(reply => reply.reply.includes('Cartera y vencimientos') ? send('1') : EMPTY),
      finalize(() => { this.sending.set(false); this.scrollToBottom(); }),
    ).subscribe({ error: error => this.error.set(error?.error?.message || 'No se pudo consultar la cartera. Intenta de nuevo.') });
  }

  autoResize(ta: HTMLTextAreaElement): void {
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
  }

  send(): void {
    const text = (this.input ?? '').trim();

    if (!text || this.sending()) return;

    if (text.length > 300) {
      this.error.set('Tu mensaje excede 300 caracteres.');
      this.sending.set(false);
      return;
    }

    this.error.set(null);
    this.sending.set(true);

    this.messages.update((arr) => [
      ...arr,
      { from: 'user', text, at: new Date() },
    ]);
    this.input = '';
    this.scrollToBottom();

    this.api.sendMessage(text).subscribe({
      next: (res) => {
        const nuevosMensajes: Msg[] = [];

        if (res.reply) {
          nuevosMensajes.push({
            from: 'bot',
            text: res.reply,
            at: new Date(),
          });
        }

        if (res.followUp) {
          nuevosMensajes.push({
            from: 'bot',
            text: res.followUp,
            at: new Date(),
          });
        }

        if (nuevosMensajes.length) {
          this.messages.update((arr) => [...arr, ...nuevosMensajes]);
        }

        this.sending.set(false);
        this.scrollToBottom();
      },
      error: (err) => {
        this.sending.set(false);
        this.error.set(err?.error?.message || 'Error enviando el mensaje.');
        this.messages.update((arr) => [
          ...arr,
          {
            from: 'bot',
            text: '⚠️ No pude procesar tu mensaje.',
            at: new Date(),
          },
        ]);
        this.scrollToBottom();
      },
    });
  }

  onEnter(ev: KeyboardEvent): void {
    if (ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault();
      this.send();
    }
  }

  private scrollToBottom(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    setTimeout(() => {
      const el = this.scrollRef?.nativeElement;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    }, 0);
  }

  formatMessage(text: string): string {
    if (!text) return '';
    return text.replace(/L\s[\d,]+\.\d{2}/g, '<b>$&</b>');
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => { if (!this.auth.token) void this.router.navigate(['/login']); },
      error: () => { /* El servicio muestra el error y conserva la sesión para reintentar. */ },
    });
  }

  removeMessage(index: number): void {
    this.messages.update((arr) => arr.filter((_, i) => i !== index));
    this.menuIndex = null;
  }

  toggleMenu(index: number): void {
    this.menuIndex = this.menuIndex === index ? null : index;
  }

  closeMenu(): void {
    this.menuIndex = null;
  }

  startPress(index: number): void {
    this.clearPressTimer();
    this.pressTimer = setTimeout(() => {
      this.menuIndex = index;
    }, 500);
  }

  cancelPress(): void {
    this.clearPressTimer();
  }

  private clearPressTimer(): void {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }
  }

  toggleCompanyProfile(): void {
    this.showCompanyProfile.update((v) => !v);
    this.isEditingCompanyProfile = false;
  }

  closeCompanyProfile(): void {
    this.showCompanyProfile.set(false);
    this.isEditingCompanyProfile = false;
  }

  startEditCompanyProfile(): void {
    if (!this.isAdmin) return;

    this.editableCompanyInfo = {
      ...this.companyInfo,
    };

    this.isEditingCompanyProfile = true;
  }

  cancelEditCompanyProfile(): void {
    this.isEditingCompanyProfile = false;
  }

  saveCompanyProfile(): void {
    if (!this.isAdmin) {
      console.log('No es admin');
      return;
    }

    console.log('Datos a guardar:', this.editableCompanyInfo);

    this.api.updatePerfil(this.editableCompanyInfo).subscribe({
      next: (resp) => {
        console.log('Perfil guardado correctamente:', resp);
        this.companyInfo = { ...this.editableCompanyInfo };
        this.isEditingCompanyProfile = false;
      },
      error: (err) => {
        console.error('Error guardando perfil:', err);
        alert(err?.error?.message || 'No se pudo guardar el perfil');
      },
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      this.editableCompanyInfo.imagen = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  get whatsappLink(): string {
  const whatsapp = this.companyInfo?.whatsapp;

  if (!whatsapp) return '#';

  let numero = whatsapp.replace(/\D/g, '');

  if (!numero.startsWith('504')) {
    numero = `504${numero}`;
  }

  return `https://wa.me/${numero}`;
}
}
