"use client"

import dynamic from 'next/dynamic'

// Créer un composant client séparé pour UseCSV
const UseCSVClient = dynamic(
  () => import('@usecsv/react').then(mod => {
    // Forcer le composant à être rendu côté client
    const UseCSV = mod.default
    return function UseCSVWrapper(props: any) {
      return <UseCSV {...props} />
    }
  }),
  { ssr: false } // Désactiver le rendu côté serveur
)

const UploadButton = () => {
  return (
    <UseCSVClient 
      importerKey="5853f460-0e00-4efe-b6fb-ed7418626ba3" 
      user={{ userId: "12345" }}
    >
      Import Data
    </UseCSVClient>
  )
}

export default UploadButton