# Uso de `ProtectedRoute`

Esta app valida la autenticación contra la API antes de renderizar cualquier pantalla privada. Para lograrlo se creó el componente cliente `ProtectedRoute`, el cual utiliza el hook `useProtectedRoute` para:

1. Buscar el token persistido en `localStorage`.
2. Consultar la API `POST /auth/validate` en **cada** carga de página protegida.
3. Redirigir automáticamente a `/auth` cuando el token ya no es válido (se elimina el token).
4. Mostrar un estado de carga mientras se valida la sesión para evitar parpadeos.
5. Si el servidor no responde o hay un error de red/CORS, se muestra un mensaje y se detiene la recarga hasta que el usuario pulse **Reintentar**.

## Cómo envolver una página protegida

```tsx
"use client";

import { ProtectedRoute } from "@/components";

export default function MiPagina() {
	return (
		<ProtectedRoute>
			{/* Contenido visible solo si el token sigue activo */}
		</ProtectedRoute>
	);
}
```

> Nota: cada vez que `ProtectedRoute` se monta, se fuerza la validación del token. Esto garantiza que, si el servidor invalida el token, el usuario será expulsado al intentar abrir cualquier vista privada.

## Tokens y sesión

- El token se obtiene mediante `POST /auth/login` y se almacena en `localStorage` a través del `AuthProvider`.
- Las utilidades en `src/utils/token.ts` se encargan de leer/escribir el token de forma encapsulada.
- Todas las llamadas de verificación usan encabezados `Authorization: Bearer <token>`.
- Al cerrar sesión se envía `POST /auth/logout` para invalidar la sesión en el backend antes de limpiar el `localStorage`.

Con esta estructura la autenticación depende siempre del estado real de la API y no solo del cliente, cumpliendo con el requisito de validar la sesión en cada ruta protegida.
