# 🎯 Comandos de Otimização e Deploy

## 📦 Minificação de Arquivos

### CSS (usando cssnano)
```bash
# Instalar
npm install -g cssnano-cli

# Minificar
cssnano style.css style.min.css

# Uso no HTML
<link rel="stylesheet" href="style.min.css">
```

### JavaScript (usando Terser)
```bash
# Instalar
npm install -g terser

# Minificar
terser script.js -o script.min.js -c -m

# Uso no HTML
<script src="script.min.js"></script>
```

### HTML (usando html-minifier)
```bash
# Instalar
npm install -g html-minifier

# Minificar
html-minifier --collapse-whitespace --remove-comments index.html -o index.min.html
```

---

## 🖼️ Otimização de Imagens

### Converter para WebP
```bash
# Instalar ImageMagick
# Windows: choco install imagemagick
# Converter
magick convert img/rauldp.png -quality 85 img/rauldp.webp
```

### Comprimir PNG
```bash
# Instalar TinyPNG CLI
npm install -g tinypng-cli

# Comprimir
tinypng img/*.png --key YOUR_API_KEY
```

---

## 📊 Google Analytics

Adicione no `<head>` do `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🔍 SEO Tools

### Validar HTML
```bash
# Online
https://validator.w3.org/

# CLI
npm install -g html-validator-cli
html-validator --file=index.html
```

### Testar Open Graph
```bash
# Facebook Debugger
https://developers.facebook.com/tools/debug/

# Twitter Card Validator
https://cards-dev.twitter.com/validator
```

---

## 🚀 Performance Testing

### Lighthouse (Chrome DevTools)
```
1. Abrir DevTools (F12)
2. Lighthouse tab
3. Generate report
4. Seguir recomendações
```

### PageSpeed Insights
```bash
https://pagespeed.web.dev/
```

### GTmetrix
```bash
https://gtmetrix.com/
```

---

## 🌐 Deploy

### GitHub Pages
```bash
# 1. Criar repositório no GitHub
# 2. Push do código
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main

# 3. Ir em Settings > Pages
# 4. Source: main branch
# 5. Save
```

### Netlify (Recomendado)
```bash
# 1. Criar conta em netlify.com
# 2. Arrastar pasta do projeto
# 3. Deploy automático
# OU via CLI:
npm install -g netlify-cli
netlify deploy --prod
```

### Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
cd theabyssdevteam
vercel --prod
```

---

## 🔒 HTTPS & Domínio

### Cloudflare (Grátis)
```
1. Criar conta em cloudflare.com
2. Adicionar site
3. Alterar nameservers no registrador
4. SSL automático
```

### Let's Encrypt (para VPS)
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Gerar certificado
sudo certbot --nginx -d seudominio.com
```

---

## 📱 Service Worker (PWA Avançado)

Criar arquivo `sw.js`:

```javascript
const CACHE_NAME = 'abyss-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

Registrar em `script.js`:

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('SW registered', reg))
    .catch(err => console.log('SW error', err));
}
```

---

## 🔧 Git Útil

```bash
# Criar .gitignore
echo "node_modules/" > .gitignore
echo "*.log" >> .gitignore
echo ".env" >> .gitignore

# Commit
git add .
git commit -m "feat: adicionar novas funcionalidades"

# Push
git push origin main

# Branch para features
git checkout -b feature/nova-funcao
git push -u origin feature/nova-funcao
```

---

## 📧 Integração de E-mail (Formulário)

### EmailJS (Recomendado)
```javascript
// 1. Criar conta em emailjs.com
// 2. Criar template
// 3. Adicionar no script.js:

emailjs.init("YOUR_USER_ID");

document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  emailjs.sendForm('service_id', 'template_id', e.target)
    .then(() => alert('Enviado!'))
    .catch(err => console.error(err));
});
```

### Formspree (Simples)
```html
<form action="https://formspree.io/f/YOUR_ID" method="POST">
  <!-- seus campos -->
</form>
```

---

## 🎨 Figma para Desenvolvedores

### Exportar Assets
```
1. Selecionar elemento
2. Export
3. Escolher formato (PNG, SVG, WebP)
4. Escolher tamanho (1x, 2x, 3x)
5. Download
```

### Pegar Cores
```
1. Selecionar elemento
2. Fill > Copiar HEX
3. Usar no CSS
```

---

## 🐛 Debug Tools

### Console Tricks
```javascript
// Múltiplas mensagens
console.log('Texto', variavel, {objeto});

// Grupo
console.group('Grupo');
console.log('Item 1');
console.log('Item 2');
console.groupEnd();

// Tabela
console.table([{a:1}, {a:2}]);

// Timer
console.time('operacao');
// ... código ...
console.timeEnd('operacao');
```

### Network Throttling
```
1. DevTools > Network
2. No throttling > Slow 3G
3. Testar carregamento
```

---

## 📚 Recursos Úteis

### Docs
- MDN: https://developer.mozilla.org/
- W3Schools: https://www.w3schools.com/
- Can I Use: https://caniuse.com/

### Design
- Coolors: https://coolors.co/
- FontAwesome: https://fontawesome.com/
- Google Fonts: https://fonts.google.com/

### Ícones
- Favicon Generator: https://realfavicongenerator.net/
- Icon Kitchen: https://icon.kitchen/

### Testing
- BrowserStack: https://www.browserstack.com/
- LambdaTest: https://www.lambdatest.com/

---

## 🚀 Checklist Final

- [ ] Minificar CSS/JS
- [ ] Comprimir imagens
- [ ] Gerar ícones PWA
- [ ] Testar em múltiplos navegadores
- [ ] Testar responsividade
- [ ] Validar HTML/CSS
- [ ] Lighthouse score > 90
- [ ] Configurar Analytics
- [ ] Testar Open Graph
- [ ] Deploy em produção
- [ ] Configurar domínio
- [ ] HTTPS ativo
- [ ] Testar formulário
- [ ] Backup do código

---

**💡 Dica Pro:** 
Use Git hooks para automatizar minificação antes de cada commit!

```bash
# .git/hooks/pre-commit
npm run minify
```

---

**🌊 The Abyss Development Team**
