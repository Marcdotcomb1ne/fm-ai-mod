# FM AI Mod - Football Manager 2023 + Gemini AI

Integração de Inteligência Artificial (Google Gemini) com Football Manager 2023 para gerar notícias, entrevistas e relatórios personalizados.

---

## Funcionalidades

### Implementadas (v1.0)
- **Monitor de Saves**: Detecta mudanças em tempo real
- **Geração de Notícias**: IA escreve notícias sobre partidas
- **Relatórios de Transferência**: Notícias automáticas de contratações
- **Notícias de Lesões**: Cobertura inteligente de lesões

### Em Desenvolvimento (v2.0)
- **Entrevistas Coletivas com IA**: Respostas contextuais inteligentes
- **Conversas com Jogadores**: Diálogos naturais
- **Narração de Partidas**: Narração ao vivo personalizada

---

## Pré-requisitos

1. **Football Manager 2023** instalado
2. **Node.js** (v18 ou superior)
3. **API Key do Google Gemini**

---

## Instalação

### Passo 1: Clone/Crie o projeto

```bash
mkdir fm-ai-mod
cd fm-ai-mod
```

### Passo 2: Salve o código

Crie a estrutura:

```
fm-ai-mod/
├── src/
│   └── index.js          # Código principal
├── package.json
├── .env
└── README.md
```

### Passo 3: Instale dependências

```bash
npm install
```

### Passo 4: Configure a API Key

Crie o arquivo `.env`:

```env
GEMINI_API_KEY=sua_chave_aqui
```

---

## Configuração

Edite as configurações em `src/index.js`:

```javascript
const CONFIG = {
    // Ajuste o caminho se necessário
    FM_PATH: 'C:\\Users\\SeuUsuario\\Documents\\Sports Interactive\\Football Manager 2023',
    
    // Ative/desative funcionalidades
    MODES: {
        NEWS: true,           // Notícias automáticas
        INTERVIEWS: true,     // Entrevistas com IA
        MATCH_REPORTS: true,  // Relatórios de partida
        PLAYER_TALKS: false   // Conversas (experimental)
    }
};
```

---

## Como Usar

### 1. Inicie o Mod

```bash
npm start
```

Você verá:
```
FM AI MOD - Football Manager AI Integration
Football Manager 2023 detectado
Gemini API configurada
Iniciando monitor...
```

### 2. Jogue Normalmente

- Abra o Football Manager 2023
- Carregue ou inicie um save
- Jogue normalmente

### 3. O Mod Detectará Automaticamente

O mod vai monitorar:
- Partidas finalizadas
- Transferências realizadas
- Lesões ocorridas
- Eventos importantes

### 4. Notícias Geradas

As notícias serão salvas em:
```
Documents/Sports Interactive/Football Manager 2023/ai_generated_news.txt
```

---

## Exemplo de Saída

### Notícia de Partida Gerada:

```
===========================================
2024-10-26 15:30:00

VITÓRIA EMOCIONANTE DO FLAMENGO

O Flamengo conquistou uma vitória importante sobre 
o Palmeiras por 3 a 2, em partida válida pelo 
Campeonato Brasileiro. Com gols de Pedro (2) e 
Gabigol, o Rubro-Negro mostrou força ofensiva.

A partida foi equilibrada, mas o Flamengo soube 
aproveitar melhor as chances criadas. O técnico 
Tite destacou a importância dos três pontos na 
luta pelo título.

Com o resultado, o Flamengo assume a liderança 
provisória do campeonato e aumenta a pressão 
sobre os concorrentes diretos.
===========================================
```

---

## Próximos Passos (Para Desenvolvedores)

### Fase 1: Monitoramento Básico (CONCLUÍDA)
- Monitor de arquivos funcionando
- Detecção de mudanças no save

### Fase 2: Parser de Saves (EM PROGRESSO)

O maior desafio é **ler os arquivos .fm** do Football Manager:

**Opções:**

1. **FM Save Parser** (biblioteca existente):
```bash
npm install fm-save-parser
```

2. **Extração Manual** via Editor do FM:
   - Exportar dados para XML
   - Ler XML com Node.js

3. **Engenharia Reversa** (complexo):
   - Decodificar formato binário
   - Não recomendado para iniciantes

### Fase 3: Injeção no Jogo

**Métodos possíveis:**

1. **Editor Database** (mais seguro):
   - Gerar arquivos `.fmf` de editor
   - Carregar no FM manualmente

2. **Mod de Skin** (intermediário):
   - Criar skin customizada
   - Injetar HTML/JS com notícias

3. **Memory Injection** (avançado):
   - Modificar memória do jogo
   - Requer conhecimento baixo nível

---

## Problemas Comuns

### Erro: "Football Manager não encontrado"

**Solução:** Ajuste o caminho em `CONFIG.FM_PATH`

Windows:
```javascript
FM_PATH: 'C:\\Users\\SeuUsuario\\Documents\\Sports Interactive\\Football Manager 2023'
```

Mac:
```javascript
FM_PATH: '/Users/SeuUsuario/Documents/Sports Interactive/Football Manager 2023'
```

### Erro: "GEMINI_API_KEY não configurada"

**Solução:** Crie o arquivo `.env` com sua chave

### Mod não detecta eventos

**Solução:** 
- Certifique-se que está jogando e salvando
- Verifique se o caminho do save está correto
- Ative o modo debug

---

## Contribuindo

Este é um projeto **open-source** e **experimental**!

**Como contribuir:**
1. Fork o repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Abra um Pull Request

**Áreas que precisam de ajuda:**
- Parser de saves `.fm`
- Interface visual
- Suporte para outros idiomas
- Testes automatizados

---

## Avisos Importantes

1. **Backup dos Saves**: Sempre faça backup antes de testar
2. **Uso por Conta Própria**: Este mod não é oficial
3. **Violação de ToS**: Verifique os termos do FM antes de usar
4. **Fase Beta**: Bugs são esperados

---

## Recursos Úteis

- [FM Modding Wiki](https://www.fmscout.com/c-fm-editing.html)
- [FM Editor Guide](https://community.sigames.com/forums/topic/500000-guide-to-the-pre-game-editor/)
- [Gemini API Docs](https://ai.google.dev/docs)

---

## Licença

MIT License - Livre para usar e modificar

---

## Roadmap Futuro

### v1.0 (Atual)
- Monitor básico
- Geração de notícias

### v2.0
- Parser completo de saves
- Entrevistas inteligentes
- Interface web

### v3.0
- Narração de partidas
- Análise tática com IA
- Scout assistido por IA

---

**Bom jogo!**