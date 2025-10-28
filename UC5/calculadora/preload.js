import {contextBridge} from 'electron'
import { version } from 'react'

contextBridge.exposeInMainWorld('api', {
    nome: 'Aplicação Desktop',
    versaoNode: () => {console.log(`NODE - ${process.versions.node}`)},
    versaoElectron: () => {console.log(`ELECTRON - ${process.versions.electron}`)},

})