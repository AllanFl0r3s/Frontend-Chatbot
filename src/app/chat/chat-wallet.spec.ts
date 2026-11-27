import { of, Subject, throwError } from 'rxjs';
import { ChatComponent } from './chat.component';

describe('Acceso guiado a la cartera de la ruta asignada', () => {
  let api: { sendMessage: jasmine.Spy };
  let chat: ChatComponent;
  beforeEach(() => {
    api = { sendMessage: jasmine.createSpy('sendMessage') };
    chat = new ChatComponent({} as any, api as any, {} as any, {});
  });
  it('muestra el saldo del servidor y conserva el borrador del usuario', () => {
    api.sendMessage.and.returnValues(of({ reply: 'Menú' }), of({ reply: 'Cartera y vencimientos' }), of({ reply: 'Saldo pendiente: L 3,200.00' }));
    chat.input = 'CLI-001'; chat.viewWallet();
    expect(chat.messages().at(-1)?.text).toBe('Saldo pendiente: L 3,200.00');
    expect(chat.input).toBe('CLI-001'); expect(chat.sending()).toBeFalse();
  });
  it('una cuenta sin permiso no dispara la opción 1 de otro menú', () => {
    api.sendMessage.and.returnValues(of({ reply: 'Menú' }), of({ reply: 'No tienes permiso para esa ruta' }));
    chat.viewWallet();
    expect(api.sendMessage.calls.allArgs()).toEqual([['menu'], ['7']]);
    expect(chat.messages().at(-1)?.text).toContain('No tienes permiso');
    expect(chat.sending()).toBeFalse();
  });
  it('un fallo del servidor no fabrica saldo ni continúa la secuencia', () => {
    api.sendMessage.and.returnValue(throwError(() => ({ error: { message: 'Servicio no disponible' } })));
    chat.viewWallet();
    expect(chat.error()).toBe('Servicio no disponible');
    expect(api.sendMessage).toHaveBeenCalledTimes(1);
    expect(chat.messages().some(message => message.text.includes('Saldo pendiente'))).toBeFalse();
    expect(chat.sending()).toBeFalse();
  });
  it('doble clic no duplica una consulta pendiente', () => {
    const pending = new Subject<{ reply: string }>(); api.sendMessage.and.returnValue(pending);
    chat.viewWallet(); chat.viewWallet();
    expect(api.sendMessage).toHaveBeenCalledTimes(1);
    pending.error({}); expect(chat.sending()).toBeFalse();
  });
});
