import { useRef, useState } from 'react'
import { clearAvatar, loadAvatar, saveAvatar, validateAvatarFile } from './avatar.ts'
import type { ProfileInfo } from './types.ts'

/**
 * The signed-in user's account details.
 *
 * Only what the gateway actually knows is shown. Under demo auth that is little — the
 * display name is the username — and the panel says so rather than leaving a reader to
 * wonder why their real name is missing.
 *
 * The profile picture is held in this browser (see avatar.ts); there is no endpoint to
 * upload one to yet.
 */
export function ProfilePanel({ profile }: { profile: ProfileInfo }) {
  const isDemo = profile.mode === 'demo'
  const initial = profile.displayName.trim().charAt(0).toUpperCase() || '?'

  // Read during the initialiser rather than in an effect, so an existing picture never
  // flashes as initials first.
  const [picture, setPicture] = useState(() => loadAvatar(profile.username))
  const [error, setError] = useState('')
  const fileInput = useRef<HTMLInputElement | null>(null)

  const choose = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    // Lets the same file be picked again after a failure — without this, re-selecting an
    // identical filename fires no change event.
    event.target.value = ''
    if (!file) return

    const rejected = validateAvatarFile(file)
    if (rejected) {
      setError(rejected)
      return
    }

    const reader = new FileReader()
    reader.onerror = () => setError('That image could not be read.')
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : ''
      if (!dataUrl) {
        setError('That image could not be read.')
        return
      }
      setPicture(dataUrl)
      setError(
        saveAvatar(profile.username, dataUrl)
          ? ''
          : 'Shown for now, but this browser would not store it, so it will go on reload.',
      )
    }
    reader.readAsDataURL(file)
  }

  const remove = () => {
    clearAvatar(profile.username)
    setPicture(undefined)
    setError('')
  }

  return (
    <div className="mp-panel">
      <div className="mp-panel-title">Profile</div>

      <div className="mp-profile">
        {picture ? (
          <img className="mp-avatar-img" src={picture} alt={`${profile.displayName}'s profile picture`} />
        ) : (
          <div className="mp-avatar" aria-hidden="true">
            {initial}
          </div>
        )}

        <div>
          <div className="mp-profile-name">{profile.displayName}</div>
          <div className="mp-profile-sub">{profile.username}</div>

          <div className="mp-avatar-actions">
            <button type="button" className="mp-link-button" onClick={() => fileInput.current?.click()}>
              {picture ? 'Change picture' : 'Upload picture'}
            </button>
            {picture ? (
              <button type="button" className="mp-link-button" onClick={remove}>
                Remove
              </button>
            ) : null}
          </div>

          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="mp-visually-hidden"
            onChange={choose}
          />
        </div>
      </div>

      {error ? (
        <p className="mp-field-error" role="alert">
          {error}
        </p>
      ) : null}

      <table className="mp-activity">
        <tbody>
          <tr>
            <th scope="row">Display name</th>
            <td>{profile.displayName}</td>
          </tr>
          <tr>
            <th scope="row">Username</th>
            <td className="mp-activity-who">{profile.username}</td>
          </tr>
          <tr>
            <th scope="row">Sign-in method</th>
            <td>
              <span className={isDemo ? 'mp-activity-status pending' : 'mp-activity-status'}>
                {isDemo ? 'Demo' : profile.mode}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <p className="mp-note">
        Your picture is saved in this browser only — it will not follow you to another device
        until profiles are stored in SAP.
        {isDemo
          ? ' You are signed in with demo credentials, which are not a security boundary, so your role, email and department will appear here once this application authenticates against SAP.'
          : ''}
      </p>
    </div>
  )
}
