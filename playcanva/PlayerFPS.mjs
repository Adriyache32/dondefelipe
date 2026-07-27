import { Script, Vec3, KEY_W, KEY_A, KEY_S, KEY_D } from 'playcanvas';

export class PlayerFPS extends Script {
    static scriptName = 'playerFPS';

    /**
     * Velocidad de desplazamiento.
     * @attribute
     * @type {number}
     */
    speed = 4;

    /**
     * Sensibilidad del mouse.
     * @attribute
     * @type {number}
     */
    sensitivity = 0.15;

    /**
     * Cámara hija del PLAYER.
     * @attribute
     * @type {import('playcanvas').Entity}
     */
    camera = null;

    initialize() {
        // Rotación vertical de la cámara
        this.pitch = 0;

        // Rotación horizontal del jugador
        this.yaw = this.entity.getEulerAngles().y;

        // Vectores reutilizables
        this.direction = new Vec3();
        this.forward = new Vec3();
        this.right = new Vec3();
        this.velocity = new Vec3();

        // Canvas de PlayCanvas
        this.canvas = this.app.graphicsDevice.canvas;

        // Click = capturar mouse
        this.canvas.addEventListener(
            'click',
            this._requestPointerLock
        );

        // Movimiento del mouse
        document.addEventListener(
            'mousemove',
            this._onMouseMove
        );

        console.log('PlayerFPS iniciado');
    }

    _requestPointerLock = () => {
        if (document.pointerLockElement !== this.canvas) {
            this.canvas.requestPointerLock();
        }
    };

    _onMouseMove = (event) => {
        // Solo mover cámara si el mouse está capturado
        if (document.pointerLockElement !== this.canvas) {
            return;
        }

        this.yaw -= event.movementX * this.sensitivity;
        this.pitch -= event.movementY * this.sensitivity;

        // Evita mirar completamente hacia atrás
        this.pitch = Math.max(-89, Math.min(89, this.pitch));
    };

    update(dt) {
        // ---------------------------------
        // ROTACIÓN
        // ---------------------------------

        // PLAYER gira horizontalmente
        this.entity.setEulerAngles(
            0,
            this.yaw,
            0
        );

        // CAMERA gira verticalmente
        if (this.camera) {
            this.camera.setLocalEulerAngles(
                this.pitch,
                0,
                0
            );
        }

        // ---------------------------------
        // INPUT WASD
        // ---------------------------------

        let x = 0;
        let z = 0;

        if (this.app.keyboard.isPressed(KEY_W)) {
            z -= 1;
        }

        if (this.app.keyboard.isPressed(KEY_S)) {
            z += 1;
        }

        if (this.app.keyboard.isPressed(KEY_A)) {
            x -= 1;
        }

        if (this.app.keyboard.isPressed(KEY_D)) {
            x += 1;
        }

        // Sin movimiento
        if (x === 0 && z === 0) {
            this._stopHorizontalMovement();
            return;
        }

        // ---------------------------------
        // DIRECCIÓN RELATIVA AL PLAYER
        // ---------------------------------

        this.forward.copy(this.entity.forward);
        this.forward.y = 0;
        this.forward.normalize();

        this.right.copy(this.entity.right);
        this.right.y = 0;
        this.right.normalize();

        this.direction.set(0, 0, 0);

        this.direction.add(
            this.forward.clone().mulScalar(-z)
        );

        this.direction.add(
            this.right.clone().mulScalar(x)
        );

        this.direction.normalize();
        this.direction.mulScalar(this.speed);

        // ---------------------------------
        // MOVIMIENTO CON FÍSICA
        // ---------------------------------

        if (this.entity.rigidbody) {

            const currentVelocity =
                this.entity.rigidbody.linearVelocity;

            this.velocity.set(
                this.direction.x,
                currentVelocity.y,
                this.direction.z
            );

            this.entity.rigidbody.linearVelocity =
                this.velocity;

        } else {

            // Fallback si no existe Rigidbody
            this.entity.translate(
                this.direction.x * dt,
                0,
                this.direction.z * dt
            );
        }
    }

    _stopHorizontalMovement() {

        if (!this.entity.rigidbody) {
            return;
        }

        const currentVelocity =
            this.entity.rigidbody.linearVelocity;

        this.velocity.set(
            0,
            currentVelocity.y,
            0
        );

        this.entity.rigidbody.linearVelocity =
            this.velocity;
    }

    destroy() {

        // Limpiar listeners
        this.canvas.removeEventListener(
            'click',
            this._requestPointerLock
        );

        document.removeEventListener(
            'mousemove',
            this._onMouseMove
        );
    }
}