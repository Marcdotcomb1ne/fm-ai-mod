import fs from 'fs';
import path from 'path';
import { watch } from 'chokidar';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const CONFIG = {
    FM_PATH: path.join(process.env.USERPROFILE || process.env.HOME, 
        'Documents/Sports Interactive/Football Manager 2023'),
    
    SAVES_PATH: 'games',
    EXPORT_PATH: 'exports',
    EDITOR_PATH: 'editor data',
    NEWS_PATH: 'editor data/db/2300/news',
    
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    
    WATCH_INTERVAL: 5000, 
    
    MODES: {
        NEWS: true,         
        INTERVIEWS: true,    
        MATCH_REPORTS: true, 
        PLAYER_TALKS: false
    }
};

class FMMonitor {
    constructor() {
        this.watchPath = path.join(CONFIG.FM_PATH, CONFIG.EXPORT_PATH);
        if (!fs.existsSync(this.watchPath)) {
            fs.mkdirSync(this.watchPath, { recursive: true });
        }
        this.lastModified = {};
        this.watcher = null;
    }

    start() {
        console.log('Iniciando monitor do Football Manager...');
        console.log(`Monitorando EXPORTS em: ${this.watchPath}`);

        this.watcher = watch(this.savePath, {
            persistent: true,
            ignoreInitial: false,
            awaitWriteFinish: {
                stabilityThreshold: 2000,
                pollInterval: 100
            }
        });

        this.watcher
            .on('add', (filePath) => this.onFileChanged(filePath, 'add'))
            .on('change', (filePath) => this.onFileChanged(filePath, 'change'))
            .on('error', (error) => console.error('❌ Erro no monitor:', error));

        console.log('Monitor ativo!');
    }

    async onFileChanged(filePath, event) {
        if (!filePath.match(/\.(txt|rtf|html)$/i)) {
            return;
        }

        console.log(`\nNovo export detectado: ${path.basename(filePath)}`);
        try {
            const saveData = await this.parseSave(filePath);
            
            if (saveData) {
                const events = this.detectEvents(saveData);
                
                if (events.length > 0) {
                    console.log(`${events.length} evento(s) detectado(s)`);
                    
                    for (const event of events) {
                        await AIEngine.processEvent(event);
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao processar arquivo:', error.message);
        }
    }

    async parseSave(filePath) {        
        try {
            const stats = fs.statSync(filePath);
            
            return {
                filePath,
                fileName: path.basename(filePath),
                size: stats.size,
                modified: stats.mtime,
            };
        } catch (error) {
            console.error('Erro ao ler save:', error);
            return null;
        }
    }

    detectEvents(saveData) {
        const events = [];        
        return events;
    }

    stop() {
        if (this.watcher) {
            this.watcher.close();
            console.log('Monitor parado');
        }
    }
}

class AIEngine {
    static async processEvent(event) {
        console.log(`Processando evento: ${event.type}`);

        switch (event.type) {
            case 'MATCH_END':
                return await this.generateMatchReport(event);
            case 'TRANSFER':
                return await this.generateTransferNews(event);
            case 'INJURY':
                return await this.generateInjuryNews(event);
            case 'INTERVIEW':
                return await this.generateInterviewResponse(event);
            default:
                console.log('Tipo de evento desconhecido');
        }
    }

    static async generateMatchReport(matchData) {
        const prompt = `Você é um jornalista esportivo brasileiro. Escreva uma notícia sobre esta partida de futebol:

Time da casa: ${matchData.homeTeam}
Time visitante: ${matchData.awayTeam}
Placar: ${matchData.score}
Gols: ${matchData.scorers?.join(', ') || 'Nenhum'}
Destaques: ${matchData.highlights || 'Partida equilibrada'}

Escreva uma notícia de 3 parágrafos, estilo profissional, sem emojis.`;

        const newsText = await this.callGemini(prompt);
        
        if (newsText) {
            console.log('Notícia de Partida gerada. Salvando...');
            await FMInjector.injectNews(newsText, 'MATCH_REPORT');
        }
    }

    static async generateTransferNews(transferData) {
        const prompt = `Você é um jornalista esportivo. Escreva uma notícia sobre esta transferência:

Jogador: ${transferData.player}
Time origem: ${transferData.fromTeam}
Time destino: ${transferData.toTeam}
Valor: ${transferData.fee || 'Não divulgado'}

Escreva uma notícia de 2 parágrafos, estilo profissional.`;

        const newsText = await this.callGemini(prompt);
        
        if (newsText) {
            console.log('Notícia de Transferência gerada. Salvando...');
            await FMInjector.injectNews(newsText, 'TRANSFER');
        }
    }

    static async generateInjuryNews(injuryData) {
        const prompt = `Escreva uma notícia sobre esta lesão:

Jogador: ${injuryData.player}
Time: ${injuryData.team}
Tipo de lesão: ${injuryData.injury}
Tempo afastado: ${injuryData.duration}

Notícia curta, 1-2 parágrafos.`;

        const newsText = await this.callGemini(prompt);
        
        if (newsText) {
            console.log('Notícia de Lesão gerada. Salvando...');
            await FMInjector.injectNews(newsText, 'INJURY');
        }
    }

    static async generateInterviewResponse(interviewData) {
        const prompt = `Você é o técnico ${interviewData.manager} do ${interviewData.team}.

Pergunta do jornalista: "${interviewData.question}"

Contexto:
- Última partida: ${interviewData.lastMatch}
- Posição na tabela: ${interviewData.position}
- Próximo adversário: ${interviewData.nextOpponent}

Responda de forma realista e contextual, como um técnico de futebol brasileiro.`;

        return await this.callGemini(prompt);
    }

    static async callGemini(prompt) {
        if (!CONFIG.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY não configurada!');
            return null;
        }

        try {
            const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${CONFIG.GEMINI_API_KEY}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        role: 'user',
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.8,
                        topK: 40,
                        topP: 0.95,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status}`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            return text || null;
        } catch (error) {
            console.error('Erro ao chamar Gemini:', error.message);
            return null;
        }
    }
}

class FMInjector {
    static async injectNews(newsText, newsType = 'GENERAL') {
        console.log('Injetando notícia no FM...');

        const newsFilePath = path.join(CONFIG.FM_PATH, CONFIG.NEWS_PATH);

        try {
            const newsXML = this.createNewsXML(newsText, newsType);

            const outputPath = path.join(CONFIG.FM_PATH, 'ai_generated_news.txt');
            fs.appendFileSync(outputPath, `\n\n${new Date().toISOString()}\n${newsText}\n${'='.repeat(50)}`);

            console.log('Notícia salva em:', outputPath);
            console.log('Próximo passo: integrar com editor do FM');

            return true;
        } catch (error) {
            console.error('Erro ao injetar notícia:', error.message);
            return false;
        }
    }

    static createNewsXML(text, type) {
        return `
<record>
    <list id="strings">
        <record>
            <string id="value">${text}</string>
        </record>
    </list>
    <integer id="type" value="${type}"/>
    <date id="date" value="${new Date().toISOString()}"/>
</record>`;
    }

    static async injectInterview(response, interviewId) {
        console.log('Injetando resposta de entrevista...');
        
        console.log('Funcionalidade em desenvolvimento');
    }
}

class FMAIMod {
    constructor() {
        this.monitor = null;
    }

    async start() {
        console.log('\n' + '='.repeat(50));
        console.log('FM AI MOD - Football Manager 2023 AI Integration');
        console.log('='.repeat(50) + '\n');

        if (!fs.existsSync(CONFIG.FM_PATH)) {
            console.error('Football Manager 2023 não encontrado!');
            console.error(`   Esperado em: ${CONFIG.FM_PATH}`);
            return;
        }

        console.log('Football Manager 2023 detectado');
        console.log(`Pasta: ${CONFIG.FM_PATH}\n`);

        if (!CONFIG.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY não configurada!');
            console.error('   Configure: export GEMINI_API_KEY=sua_chave\n');
            return;
        }

        console.log('Gemini API configurada\n');

        console.log('Modos ativos:');
        Object.entries(CONFIG.MODES).forEach(([mode, active]) => {
            console.log(`   ${active ? '✅' : '⬜'} ${mode}`);
        });
        console.log('');

        this.monitor = new FMMonitor();
        this.monitor.start();

        console.log('\nDica: Jogue normalmente o FM23, o mod detectará eventos automaticamente!');
        console.log('Para parar: Ctrl+C\n');
    }

    stop() {
        if (this.monitor) {
            this.monitor.stop();
        }
        console.log('\nMod encerrado. Até logo!');
    }
}

const mod = new FMAIMod();

mod.start().catch(error => {
    console.error('Erro fatal:', error);
    process.exit(1);
});

process.on('SIGINT', () => {
    mod.stop();
    process.exit(0);
});

export { FMMonitor, AIEngine, FMInjector, FMAIMod };