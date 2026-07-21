import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  BadgeCheck,
  Briefcase,
  Clock,
  RefreshCw,
  XCircle,
} from 'lucide-react';

import {
  adminNavConfig,
} from '../../../../../core/shared/config/navigation/adminNavConfig';

import {
  BASE_URL,
} from '../../../../../core/shared/config/api';

import {
  Sidebar,
} from '../../../../../core/shared/layout/Sidebar';

import {
  fetchAuth,
  logout,
} from '../../../../../core/shared/utils/auth';

type BusinessRequestStatus =
  | 'pendiente'
  | 'aprobado'
  | 'rechazado';

interface BusinessRequest {
  id: string;
  name: string;
  businessTypeName: string;
  address: string | null;
  municipality: string | null;
  state: string | null;
  imageUrl: string | null;
  requestStatus: BusinessRequestStatus;
  createdAt: string;
  owner: {
    name: string | null;
    email: string | null;
  };
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

const statusLabel: Record<
  BusinessRequestStatus,
  string
> = {
  pendiente: 'Pendiente',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
};

const statusColor: Record<
  BusinessRequestStatus,
  string
> = {
  pendiente: '#f59e0b',
  aprobado: '#16a34a',
  rechazado: '#dc2626',
};

export function AdminNegociosPage() {
  const [
    negocios,
    setNegocios,
  ] = useState<BusinessRequest[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    actionId,
    setActionId,
  ] = useState<string | null>(null);

  const cargar =
    useCallback(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await fetchAuth(
            `${BASE_URL}/businesses/admin/requests?status=todas&limit=100`,
          );

        const body =
          await response.json() as ApiResponse<
            BusinessRequest[]
          >;

        if (
          !response.ok ||
          !body.success
        ) {
          throw new Error(
            body.message ??
              'Error al cargar solicitudes',
          );
        }

        setNegocios(
          body.data ?? [],
        );
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Error de conexión',
        );

        setNegocios([]);
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const validar = async (
    negocio: BusinessRequest,
    action: 'approve' | 'reject',
  ) => {
    setActionId(negocio.id);
    setError(null);

    try {
      const response =
        await fetchAuth(
          `${BASE_URL}/businesses/${negocio.id}/validate`,
          {
            method: 'PATCH',
            body: JSON.stringify({
              action,
            }),
          },
        );

      const body =
        await response
          .json()
          .catch(
            () => null,
          ) as ApiResponse | null;

      if (
        !response.ok ||
        !body?.success
      ) {
        throw new Error(
          body?.message ??
            (
              action === 'approve'
                ? 'No se pudo aprobar el negocio'
                : 'No se pudo rechazar el negocio'
            ),
        );
      }

      const nuevoStatus:
        BusinessRequestStatus =
        action === 'approve'
          ? 'aprobado'
          : 'rechazado';

      setNegocios(
        (current) =>
          current.map(
            (item) =>
              item.id === negocio.id
                ? {
                    ...item,
                    requestStatus:
                      nuevoStatus,
                  }
                : item,
          ),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo validar el negocio',
      );
    } finally {
      setActionId(null);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f7f5',
      }}
    >
      <Sidebar
        config={adminNavConfig}
        onLogout={logout}
      />

      <main
        style={{
          marginLeft: 260,
          minHeight: '100vh',
          padding: 32,
          fontFamily:
            'Inter, system-ui, sans-serif',
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent:
              'space-between',
            marginBottom: 28,
          }}
        >
          <div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#16a34a',
                textTransform:
                  'uppercase',
                letterSpacing: 1,
              }}
            >
              Gestión Turística
            </span>

            <h1
              style={{
                margin: '4px 0',
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              Solicitudes de Negocio
            </h1>

            <p
              style={{
                color: '#6b7280',
                marginTop: 4,
              }}
            >
              Aprueba o rechaza los
              negocios turísticos
              registrados.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void cargar()
            }
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              border:
                '1px solid #d1d5db',
              borderRadius: 8,
              background: '#fff',
              cursor: isLoading
                ? 'not-allowed'
                : 'pointer',
              fontWeight: 500,
            }}
          >
            <RefreshCw
              size={16}
            />

            Actualizar
          </button>
        </header>

        {error && (
          <div
            style={{
              background:
                '#fef2f2',
              border:
                '1px solid #fca5a5',
              borderRadius: 8,
              padding:
                '12px 16px',
              marginBottom: 16,
              color: '#b91c1c',
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems:
                'center',
              gap: 16,
            }}
          >
            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                void cargar()
              }
              style={{
                background:
                  'none',
                border: 'none',
                cursor:
                  'pointer',
                color:
                  '#b91c1c',
                fontWeight: 600,
              }}
            >
              Reintentar
            </button>
          </div>
        )}

        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            border:
              '1px solid #e5e7eb',
            overflow: 'hidden',
          }}
        >
          {isLoading ? (
            <div
              style={{
                padding: 48,
                textAlign:
                  'center',
                color:
                  '#9ca3af',
              }}
            >
              Cargando solicitudes...
            </div>
          ) : negocios.length ===
              0 &&
            !error ? (
            <div
              style={{
                padding: 48,
                textAlign:
                  'center',
                color:
                  '#9ca3af',
              }}
            >
              <Briefcase
                size={40}
                style={{
                  marginBottom: 12,
                  opacity: 0.4,
                }}
              />

              <p>
                No hay solicitudes de
                negocio.
              </p>
            </div>
          ) : (
            <div
              style={{
                overflowX: 'auto',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse:
                    'collapse',
                  fontSize: 14,
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        '#f9fafb',
                      borderBottom:
                        '1px solid #e5e7eb',
                    }}
                  >
                    <th
                      style={{
                        padding:
                          '12px 16px',
                        textAlign:
                          'left',
                        fontWeight:
                          600,
                        color:
                          '#374151',
                      }}
                    >
                      Negocio
                    </th>

                    <th
                      style={{
                        padding:
                          '12px 16px',
                        textAlign:
                          'left',
                        fontWeight:
                          600,
                        color:
                          '#374151',
                      }}
                    >
                      Tipo
                    </th>

                    <th
                      style={{
                        padding:
                          '12px 16px',
                        textAlign:
                          'left',
                        fontWeight:
                          600,
                        color:
                          '#374151',
                      }}
                    >
                      Municipio
                    </th>

                    <th
                      style={{
                        padding:
                          '12px 16px',
                        textAlign:
                          'left',
                        fontWeight:
                          600,
                        color:
                          '#374151',
                      }}
                    >
                      Estado
                    </th>

                    <th
                      style={{
                        padding:
                          '12px 16px',
                        textAlign:
                          'left',
                        fontWeight:
                          600,
                        color:
                          '#374151',
                      }}
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {negocios.map(
                    (
                      negocio,
                      index,
                    ) => (
                      <tr
                        key={
                          negocio.id
                        }
                        style={{
                          borderBottom:
                            index <
                            negocios.length -
                              1
                              ? '1px solid #f3f4f6'
                              : 'none',
                        }}
                      >
                        <td
                          style={{
                            padding:
                              '14px 16px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight:
                                500,
                            }}
                          >
                            {
                              negocio.name
                            }
                          </div>

                          {negocio.owner
                            .name && (
                            <div
                              style={{
                                fontSize:
                                  12,
                                color:
                                  '#9ca3af',
                              }}
                            >
                              {
                                negocio
                                  .owner
                                  .name
                              }
                            </div>
                          )}

                          {negocio.owner
                            .email && (
                            <div
                              style={{
                                fontSize:
                                  11,
                                color:
                                  '#9ca3af',
                              }}
                            >
                              {
                                negocio
                                  .owner
                                  .email
                              }
                            </div>
                          )}
                        </td>

                        <td
                          style={{
                            padding:
                              '14px 16px',
                            color:
                              '#6b7280',
                          }}
                        >
                          {
                            negocio.businessTypeName
                          }
                        </td>

                        <td
                          style={{
                            padding:
                              '14px 16px',
                            color:
                              '#6b7280',
                          }}
                        >
                          {negocio.municipality ??
                            '—'}
                        </td>

                        <td
                          style={{
                            padding:
                              '14px 16px',
                          }}
                        >
                          <span
                            style={{
                              display:
                                'inline-flex',
                              alignItems:
                                'center',
                              gap: 5,
                              fontWeight:
                                600,
                              color:
                                statusColor[
                                  negocio
                                    .requestStatus
                                ],
                              fontSize:
                                13,
                            }}
                          >
                            {negocio.requestStatus ===
                              'aprobado' && (
                              <BadgeCheck
                                size={
                                  15
                                }
                              />
                            )}

                            {negocio.requestStatus ===
                              'pendiente' && (
                              <Clock
                                size={
                                  15
                                }
                              />
                            )}

                            {negocio.requestStatus ===
                              'rechazado' && (
                              <XCircle
                                size={
                                  15
                                }
                              />
                            )}

                            {
                              statusLabel[
                                negocio
                                  .requestStatus
                              ]
                            }
                          </span>
                        </td>

                        <td
                          style={{
                            padding:
                              '14px 16px',
                          }}
                        >
                          <div
                            style={{
                              display:
                                'flex',
                              gap: 8,
                            }}
                          >
                            {negocio.requestStatus !==
                              'aprobado' && (
                              <button
                                type="button"
                                disabled={
                                  actionId ===
                                  negocio.id
                                }
                                onClick={() =>
                                  void validar(
                                    negocio,
                                    'approve',
                                  )
                                }
                                style={{
                                  padding:
                                    '6px 14px',
                                  borderRadius:
                                    6,
                                  border:
                                    'none',
                                  cursor:
                                    actionId ===
                                    negocio.id
                                      ? 'not-allowed'
                                      : 'pointer',
                                  fontWeight:
                                    500,
                                  fontSize:
                                    13,
                                  background:
                                    '#dcfce7',
                                  color:
                                    '#16a34a',
                                }}
                              >
                                {actionId ===
                                negocio.id
                                  ? '...'
                                  : 'Aprobar'}
                              </button>
                            )}

                            {negocio.requestStatus !==
                              'rechazado' && (
                              <button
                                type="button"
                                disabled={
                                  actionId ===
                                  negocio.id
                                }
                                onClick={() =>
                                  void validar(
                                    negocio,
                                    'reject',
                                  )
                                }
                                style={{
                                  padding:
                                    '6px 14px',
                                  borderRadius:
                                    6,
                                  border:
                                    'none',
                                  cursor:
                                    actionId ===
                                    negocio.id
                                      ? 'not-allowed'
                                      : 'pointer',
                                  fontWeight:
                                    500,
                                  fontSize:
                                    13,
                                  background:
                                    '#fee2e2',
                                  color:
                                    '#dc2626',
                                }}
                              >
                                {actionId ===
                                negocio.id
                                  ? '...'
                                  : 'Rechazar'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}