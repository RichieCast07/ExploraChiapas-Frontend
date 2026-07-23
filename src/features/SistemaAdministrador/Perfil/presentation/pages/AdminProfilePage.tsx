import {
  Camera,
  CheckCircle2,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  Trash2,
  UserRound,
  XCircle,
} from 'lucide-react';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  apiRequest,
  apiVoid,
  resolveMediaUrl,
} from '../../../../../core/shared/api/apiClient';

import {
  PanelShell,
} from '../../../../../core/shared/layout/PanelShell';

import './AdminProfilePage.css';

interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  imgUrl: string | null;
  userType: string;
  active: boolean;
}

interface UploadResult {
  usuarioId: string;
  imageProfileUrl: string;
}

export function AdminProfilePage() {
  const [profile, setProfile] =
    useState<ApiUser | null>(null);
  const [name, setName] =
    useState('');
  const [email, setEmail] =
    useState('');
  const [phone, setPhone] =
    useState('');
  const [loading, setLoading] =
    useState(true);
  const [saving, setSaving] =
    useState(false);
  const [uploading, setUploading] =
    useState(false);
  const [message, setMessage] =
    useState<{
      type: 'ok' | 'error';
      text: string;
    } | null>(null);

  const load = async () => {
    setLoading(true);

    try {
      const data =
        await apiRequest<ApiUser>(
          '/users/profile',
        );

      setProfile(data);
      setName(data.name);
      setEmail(data.email);
      setPhone(data.phone ?? '');
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el perfil.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const avatarUrl =
    useMemo(
      () =>
        resolveMediaUrl(
          profile?.imgUrl ?? null,
        ),
      [profile?.imgUrl],
    );

  const sync = (
    next: ApiUser,
  ) => {
    localStorage.setItem(
      'user_name',
      next.name,
    );

    window.dispatchEvent(
      new CustomEvent(
        'ec-profile-updated',
        { detail: next },
      ),
    );
  };

  const save = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const updated =
        await apiRequest<ApiUser>(
          '/users/profile',
          {
            method: 'PATCH',
            headers: {
              'Content-Type':
                'application/json',
            },
            body:
              JSON.stringify({
                name: name.trim(),
                email:
                  email
                    .trim()
                    .toLowerCase(),
                phone:
                  phone.trim() ||
                  null,
              }),
          },
        );

      setProfile(updated);
      setName(updated.name);
      setEmail(updated.email);
      setPhone(updated.phone ?? '');
      sync(updated);

      setMessage({
        type: 'ok',
        text:
          'Perfil actualizado correctamente.',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'No se pudo guardar el perfil.',
      });
    } finally {
      setSaving(false);
    }
  };

  const uploadPhoto = async (
    event:
      React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    event.target.value = '';

    if (!file) return;

    if (
      ![
        'image/jpeg',
        'image/png',
        'image/webp',
      ].includes(file.type)
    ) {
      setMessage({
        type: 'error',
        text:
          'La imagen debe ser JPG, PNG o WEBP.',
      });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const data =
        new FormData();

      data.append(
        'imagen',
        file,
      );

      const result =
        await apiRequest<UploadResult>(
          '/uploads/usuarios/perfil',
          {
            method: 'POST',
            body: data,
          },
        );

      if (profile) {
        const updated = {
          ...profile,
          imgUrl:
            result.imageProfileUrl,
        };

        setProfile(updated);
        sync(updated);
      }

      setMessage({
        type: 'ok',
        text:
          'Fotografía actualizada.',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'No se pudo subir la fotografía.',
      });
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto =
    async () => {
      if (!profile?.imgUrl) return;

      if (
        !window.confirm(
          '¿Eliminar tu fotografía de perfil?',
        )
      ) {
        return;
      }

      setUploading(true);

      try {
        await apiVoid(
          '/uploads/usuarios/perfil',
          { method: 'DELETE' },
        );

        const updated = {
          ...profile,
          imgUrl: null,
        };

        setProfile(updated);
        sync(updated);

        setMessage({
          type: 'ok',
          text:
            'Fotografía eliminada.',
        });
      } catch (error) {
        setMessage({
          type: 'error',
          text:
            error instanceof Error
              ? error.message
              : 'No se pudo eliminar la fotografía.',
        });
      } finally {
        setUploading(false);
      }
    };

  return (
    <PanelShell kind="admin">
      <div className="ec-page admin-profile-page">
        <div className="ec-page-header">
          <div className="ec-page-header__copy">
            <div className="ec-breadcrumb">
              Administración
              <span>›</span>
              Mi perfil
            </div>

            <h1 className="ec-page-title">
              Mi perfil
            </h1>

            <p className="ec-page-subtitle">
              Administra tu identidad y datos de contacto dentro de ExploraChiapas.
            </p>
          </div>

          <span className="admin-profile-role">
            <ShieldCheck size={16} />
            Administrador de plataforma
          </span>
        </div>

        {message && (
          <div className={`admin-profile-message admin-profile-message--${message.type}`}>
            {message.type === 'ok'
              ? <CheckCircle2 size={17} />
              : <XCircle size={17} />}
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="admin-profile-loading">
            Cargando perfil...
          </div>
        ) : (
          <div className="admin-profile-grid">
            <aside className="admin-profile-card admin-profile-identity">
              <div className="admin-profile-avatar">
                <span>
                  {(profile?.name ?? '?')
                    .charAt(0)
                    .toUpperCase()}
                </span>

                {avatarUrl && (
                  <img
                    src={avatarUrl}
                    alt="Perfil"
                  />
                )}
              </div>

              <strong>
                {profile?.name}
              </strong>

              <small>
                {profile?.email}
              </small>

              <div className="admin-profile-photo-actions">
                <label>
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploading}
                    onChange={(event) =>
                      void uploadPhoto(event)
                    }
                  />
                  <Camera size={15} />
                  {uploading
                    ? 'Procesando...'
                    : 'Cambiar foto'}
                </label>

                {profile?.imgUrl && (
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() =>
                      void deletePhoto()
                    }
                  >
                    <Trash2 size={15} />
                    Eliminar
                  </button>
                )}
              </div>

              <div className="admin-profile-meta">
                <span>Rol</span>
                <strong>
                  Superadministrador
                </strong>
                <span>Estado</span>
                <strong>
                  {profile?.active
                    ? 'Activo'
                    : 'Inactivo'}
                </strong>
              </div>
            </aside>

            <form
              className="admin-profile-card admin-profile-form"
              onSubmit={(event) =>
                void save(event)
              }
            >
              <div className="admin-profile-form-title">
                <UserRound size={18} />
                <div>
                  <h2>
                    Información personal
                  </h2>
                  <p>
                    Los cambios se reflejan en tu cuenta administrativa.
                  </p>
                </div>
              </div>

              <div className="admin-profile-fields">
                <label>
                  <span>
                    Nombre completo
                  </span>
                  <div>
                    <UserRound size={16} />
                    <input
                      required
                      minLength={3}
                      maxLength={100}
                      value={name}
                      onChange={(event) =>
                        setName(
                          event.target.value,
                        )
                      }
                    />
                  </div>
                </label>

                <label>
                  <span>
                    Correo electrónico
                  </span>
                  <div>
                    <Mail size={16} />
                    <input
                      required
                      type="email"
                      maxLength={150}
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value,
                        )
                      }
                    />
                  </div>
                </label>

                <label>
                  <span>
                    Teléfono
                  </span>
                  <div>
                    <Phone size={16} />
                    <input
                      type="tel"
                      maxLength={20}
                      value={phone}
                      placeholder="+52 961 000 0000"
                      onChange={(event) =>
                        setPhone(
                          event.target.value,
                        )
                      }
                    />
                  </div>
                  <small>
                    Opcional. Entre 10 y 15 dígitos.
                  </small>
                </label>
              </div>

              <footer>
                <span>
                  Tu correo se usa como identificador de acceso.
                </span>

                <button
                  type="submit"
                  disabled={saving}
                >
                  <Save size={16} />
                  {saving
                    ? 'Guardando...'
                    : 'Guardar cambios'}
                </button>
              </footer>
            </form>
          </div>
        )}
      </div>
    </PanelShell>
  );
}
