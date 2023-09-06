
export enum KeyState {
  Unknown = 0,
  Up = 1,
  Down = 2,
}


export class InputState {
  _keyState : Record<string, KeyState>;

  constructor() {
    this._keyState = {};

    window.addEventListener(
      'keydown',
      (ev: KeyboardEvent) => {
        this.updateKeyState(ev);
      }
    );

    window.addEventListener(
      'keyup',
      (ev: KeyboardEvent) => {
        this.updateKeyState(ev);
      }
    );
  }

  updateKeyState(ev: KeyboardEvent) : boolean {
    let stateChanged = false;
    if (ev.type === 'keydown') {
      if (this._keyState[ev.key] === KeyState.Up) {
        stateChanged = true;
      }
      this._keyState[ev.key] = KeyState.Down;
    }
    if (ev.type === 'keyup') {
      if (this._keyState[ev.key] === KeyState.Down) {
        stateChanged = true;
      }
      this._keyState[ev.key] = KeyState.Up;
    }
    return stateChanged;
  }

  getKeyState(keyName: string) : KeyState {
    if (! this._keyState[keyName]) {
      return KeyState.Unknown;
    }
    return this._keyState[keyName];
  }
}


