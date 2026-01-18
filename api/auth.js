import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Simulação de banco de dados (em produção, usar PostgreSQL/MongoDB)
const users = [
    {
        id: 1,
        email: 'raul@theabyss.dev',
        // Senha: Raul-TheAbyss@
        passwordHash: '$2b$10$rKumImw85tSYmq8tfhvfOuC1A.pWmIPpMVUHrAQdB1ETFkzPZ/6hy',
        name: 'Raul Leite',
        role: 'admin',
        permissions: ['all']
    }
];

const JWT_SECRET = process.env.JWT_SECRET || 'theabyss_secret_key_2026';

// Rota de Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validação básica
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email e senha são obrigatórios' 
            });
        }

        // Buscar usuário
        const user = users.find(u => u.email === email);
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciais inválidas' 
            });
        }

        // Verificar senha
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        
        if (!passwordMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciais inválidas' 
            });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role,
                permissions: user.permissions 
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Retornar dados do usuário (sem senha)
        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                permissions: user.permissions
            },
            token
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

// Rota de Logout
router.post('/logout', (req, res) => {
    try {
        // Em produção, adicionar token à blacklist
        res.json({
            success: true,
            message: 'Logout realizado com sucesso'
        });
    } catch (error) {
        console.error('Erro no logout:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao fazer logout' 
        });
    }
});

// Middleware para verificar token
router.get('/verify', (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Token não fornecido' 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = users.find(u => u.id === decoded.id);

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Usuário não encontrado' 
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                permissions: user.permissions
            }
        });

    } catch (error) {
        console.error('Erro na verificação:', error);
        res.status(401).json({ 
            success: false, 
            message: 'Token inválido ou expirado' 
        });
    }
});

// Rota para solicitar acesso
router.post('/request-access', async (req, res) => {
    try {
        const { name, email, reason } = req.body;

        if (!name || !email || !reason) {
            return res.status(400).json({ 
                success: false, 
                message: 'Todos os campos são obrigatórios' 
            });
        }

        // Salvar solicitação no banco de dados
        // Por enquanto, apenas log
        console.log('Nova solicitação de acesso:', { name, email, reason });

        res.json({
            success: true,
            message: 'Solicitação enviada com sucesso! Aguarde aprovação.'
        });

    } catch (error) {
        console.error('Erro ao solicitar acesso:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao processar solicitação' 
        });
    }
});

// Função auxiliar para gerar hash de senha (usar no setup inicial)
async function generatePasswordHash(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

// Descomentar para gerar novo hash
// generatePasswordHash('Raul-TheAbyss@').then(hash => {
//     console.log('Hash gerado:', hash);
// });

export default router;
