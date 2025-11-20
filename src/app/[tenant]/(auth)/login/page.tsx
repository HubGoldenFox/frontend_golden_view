'use client'

import { useState } from 'react'

import Email from './forgot-password'
import Login from './login'
import NewPassword from './reset-password'
import Code from './verify-code'

const AuthFlow = () => {
  const [control, setControl] = useState(0)
  const [token, setToken] = useState('')

  const renderStep = () => {
    switch (control) {
      case 0:
        return <Login setControl={setControl} />
      case 1:
        return (
          <Email setControl={setControl} token={token} setToken={setToken} />
        )
      case 2:
        return (
          <Code setControl={setControl} token={token} setToken={setToken} />
        )
      case 3:
        return (
          <NewPassword
            setControl={setControl}
            token={token}
            setToken={setToken}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      {/* Background Pattern - global */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 left-0 w-full h-full bg-repeat opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232B4229' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Conteúdo atual */}
      <div className="relative z-10">{renderStep()}</div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.2s both;
        }

        .animate-slide-up {
          animation: slide-up 0.7s ease-out 0.1s both;
        }
      `}</style>
    </div>
  )
}

export default AuthFlow
