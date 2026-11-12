# Checklist de publicacion (Fase 5)

> Para Luis. Sintaxis PowerShell, desde la raiz del repo. Nada de esto lo ejecuta Claude Code: merge, deploy y subida a Hugging Face son tuyos.
> Estado al 2026-11-12: F4 cerrada. Hay una corrida real en `results/` (150 preguntas, 4 modelos), `web/datos.json` esta generado y las 150 preguntas tienen `validado_por`. Pasos 1, 2 y 4 repetidos por Claude Code ese dia sobre `main` (ver el final).

## 0. Antes de nada

- [x] Gate de F4 aprobado (2026-11-12): 150 preguntas, 4 modelos, revision humana del juez y 150 preguntas selladas.
- [x] Corridas reales guardadas en `results/<modelo>/2026-11-12_151044.json`.

```powershell
git status
git branch --show-current
```

## 1. Generar los datos de la web

```powershell
npm ci
npm run web:datos
Get-Content web\datos.json | Select-Object -First 20
```

- [ ] `web/datos.json` lista los modelos esperados y la fecha de la ultima corrida.
- [ ] Con `results/` vacio el JSON sale con `"modelos": []` (la pagina muestra "Aun no hay corridas publicadas").

## 2. Tests

```powershell
npm test
```

- [ ] Todo en verde.

## 3. Web en telefono real (gate de interfaz, regla 5)

Servidor local en tu red (sirve `web/`; el telefono y el PC en la misma WiFi):

```powershell
cd web
node -e "require('http').createServer((q,r)=>{const f=require('path').join(process.cwd(),q.url==='/'?'index.html':q.url.split('?')[0]);const t={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json'};require('fs').readFile(f,(e,d)=>{if(e){r.statusCode=404;return r.end()}r.setHeader('content-type',t[require('path').extname(f)]||'text/plain');r.end(d)})}).listen(8080)"
ipconfig | Select-String "IPv4"
```

Abre `http://<tu_IPv4>:8080/` en el telefono, con datos moviles no (es red local) y DevTools del PC cerrado.

- [ ] Sin scroll horizontal a 390 px, texto legible, botones ES/EN y filtros por dominio tocables.
- [ ] El aviso de no-asesoria se ve arriba sin hacer scroll.
- [ ] Cambia ES/EN y filtra por dominio.
- [ ] Estado vacio verificado (renombra `web\datos.json` un momento, o prueba antes de la primera corrida).
- [ ] Repite en la URL desplegada (paso 5) con datos moviles.

## 4. Auditoria de secretos y privadas (antes de cada push publico)

```powershell
git grep -nE "sk-ant-[A-Za-z0-9_-]{10,}|sk-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{30,}|hf_[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|xox[bp]-|BEGIN [A-Z ]*PRIVATE KEY|AKIA[0-9A-Z]{16}"
git log --all -p | Select-String -Pattern "sk-ant-[A-Za-z0-9_-]{10,}|AIza[0-9A-Za-z_-]{30,}|hf_[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|BEGIN [A-Z ]*PRIVATE KEY" | Measure-Object
git ls-files | Select-String -Pattern "(^|/)\.env($|\.)|privadas|\.cache"
git log --all --name-only --format= | Select-String -Pattern "(^|/)\.env$|privadas|\.cache"
git grep -niE "mini[p]erfum|astro[s]tore|emple[o]|postula[c]|prospec[c]"
git check-ignore -v data/privadas/prueba.jsonl
git ls-files data/privadas
```

Esperado: los dos primeros sin coincidencias (Count 0), el tercero solo `.env.example` y los fuentes `src/cache/*` (no son datos), el cuarto vacio, el quinto vacio, `check-ignore` apunta a `.gitignore`, y `git ls-files data/privadas` vacio.

- [ ] Resultado de la auditoria hecha por Claude Code el 2026-11-12 sobre la rama `f5-publicacion`: ver "Resultado de la auditoria" abajo. Repetirla tu antes del push final.
- [ ] `results/` no contiene claves, ni respuestas con datos de prueba sensibles (revisa un archivo al azar: `Get-Content results\<modelo>\<fecha>.json -TotalCount 40`).
- [ ] `.env` no esta versionado y `.env.example` tiene las claves vacias.
- [ ] Rotar las claves de API que hayas usado en las corridas (opcional, recomendado tras el incidente de seguridad del PC).

## 5. Deploy de la web (lo ejecutas tu)

Opcion A, Vercel (carpeta `web/` como sitio estatico, sin build):

```powershell
npx vercel@latest deploy web --prod
```

Opcion B, GitHub Pages: en el repo, Settings > Pages, fuente "Deploy from a branch", carpeta `/web` (si la UI no ofrece `/web`, publicar desde una rama `gh-pages` con el contenido de `web/`).

- [ ] URL publica abierta con datos moviles, sin errores en consola.
- [ ] La URL de la demo queda anotada en `README.md` (lo actualiza el Director).

## 6. Dataset en Hugging Face (lo ejecutas tu)

Python no esta instalado en la laptop (regla 10), asi que la via sin instalar nada es la web:

1. huggingface.co > New > Dataset > nombre `eval-ve`, licencia CC BY 4.0, publico.
2. Pestana Files > Add file > Upload: sube `data\preguntas.jsonl` como `preguntas.jsonl`.
3. Crea `README.md` del dataset pegando el contenido de `docs\huggingface\README.md` con los `[placeholder]` completados.

```powershell
Get-Content data\preguntas.jsonl | Measure-Object -Line
```

- [ ] `[n_pendiente]`, `[validadas_pendiente]` y `[version_pendiente]` de la card completados con numeros reales.
- [ ] Solo se subio `preguntas.jsonl`. NO `data\privadas\`, NO `.cache`, NO `results\` con respuestas crudas si no quieres publicarlas.
- [ ] Confirmado: el conjunto privado no esta en Hugging Face (revisa la pestana Files).
- [ ] Solo se publican preguntas con `validado_por` lleno (regla 3 de CLAUDE.md).

## 7. CITATION.cff

```powershell
Select-String -Path CITATION.cff -Pattern "pendiente"
```

- [ ] Descomenta y completa `version`, `date-released` y `doi` cuando existan. Autor y URL ya estan (tomados de LICENSE y del remoto `origin`).

## 8. Cierre

- [ ] `README.md` actualizado con resultados reales y la URL de la demo (Director).
- [ ] Confirmacion explicita: `data/privadas/` no aparece en ningun artefacto publicado (git, Hugging Face, Vercel).
- [ ] Merge del PR de F5 a `main` hecho por ti (merge = deploy si `main` esta conectado a Vercel).

## Resultado de la auditoria (2026-11-12, rama `f5-publicacion`)

- Claves y tokens en el arbol (`git grep`, patrones de Anthropic, OpenAI, Google, Hugging Face, GitHub, Slack, AWS, clave privada): 0 coincidencias.
- Historial completo (`git log --all -p`): 0 coincidencias de esos patrones. El texto `sk-ant` aparece solo como texto de un test del runner, sin clave.
- Archivos rastreados que coinciden con `.env`, `privadas` o `.cache`: solo `.env.example` (claves vacias) y `src/cache/*` (codigo).
- `.env`, `data/privadas/` y `.cache/` nunca estuvieron en el historial.
- `git grep` de palabras de negocios y uso privado del autor: vacio.

## Auditoria repetida (2026-11-12, `main` tras el PR #12)

- Claves y tokens en el arbol y en todo el historial: 0 coincidencias.
- Archivos rastreados que coinciden con `.env`, `privadas` o `.cache`: solo `.env.example`. Nunca estuvieron en el historial.
- `git ls-files data`: solo `README.md` y `preguntas.jsonl`. Palabras de negocios o uso privado del autor: 0.
- `results/`, `web/` y `data/` no contienen rutas locales ni nombres de usuario del equipo.
