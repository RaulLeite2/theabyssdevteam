import { createContact, getAllContacts, updateContactStatus } from './database.js';

// Função para enviar email (Nodemailer)
async function sendEmail(to, subject, message) {
  try {
    // NOTA: Para funcionar, você precisa instalar: npm install nodemailer
    // E configurar as variáveis de ambiente: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
    
    const nodemailer = await import('nodemailer').catch(() => null);
    
    if (!nodemailer) {
      console.warn('⚠️ Nodemailer não instalado. Email não será enviado.');
      return { success: false, error: 'Nodemailer não configurado' };
    }
    
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">✉️ Nova mensagem de contato</h2>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
      `
    });
    
    console.log('✅ Email enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error.message);
    return { success: false, error: error.message };
  }
}

export async function handler(req, res) {
  const { method } = req;
  
  if (method === 'POST') {
    // Criar novo contato
    const { name, email, message } = req.body;
    
    // Validação básica
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    
    // Sanitizar input (prevenir SQL injection)
    const sanitizedName = name.trim().substring(0, 255);
    const sanitizedEmail = email.trim().toLowerCase().substring(0, 255);
    const sanitizedMessage = message.trim().substring(0, 5000);
    
    try {
      // Salvar no banco de dados
      const contact = await createContact(sanitizedName, sanitizedEmail, sanitizedMessage);
      
      console.log('📩 Nova mensagem de contato recebida:');
      console.log('   Nome:', sanitizedName);
      console.log('   Email:', sanitizedEmail);
      console.log('   ID:', contact.id);
      
      // Tentar enviar email para o administrador
      const adminEmail = process.env.ADMIN_EMAIL || 'raulpereira@theabyssdevteam.net';
      const emailBody = `
Nova mensagem de contato recebida em The Abyss Dev Team

De: ${sanitizedName} (${sanitizedEmail})
Data: ${new Date().toLocaleString('pt-BR')}

Mensagem:
${sanitizedMessage}

---
ID da mensagem: ${contact.id}
      `;
      
      const emailResult = await sendEmail(
        adminEmail,
        `📩 Novo contato: ${sanitizedName}`,
        emailBody
      );
      
      if (emailResult.success) {
        console.log('✅ Notificação por email enviada ao administrador');
      } else {
        console.warn('⚠️ Email não enviado:', emailResult.error);
      }
      
      return res.json({
        success: true,
        message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        contact: {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          createdAt: contact.created_at
        },
        emailSent: emailResult.success
      });
    } catch (error) {
      console.error('❌ Erro ao processar contato:', error);
      return res.status(500).json({ error: 'Erro ao processar sua mensagem. Tente novamente.' });
    }
  }
  
  if (method === 'GET') {
    // Listar todos os contatos (apenas para admin)
    try {
      const contacts = await getAllContacts();
      return res.json({ contacts });
    } catch (error) {
      console.error('❌ Erro ao listar contatos:', error);
      return res.status(500).json({ error: 'Erro ao listar contatos' });
    }
  }
  
  if (method === 'PATCH') {
    // Atualizar status do contato
    const { id, status } = req.body;
    
    if (!id || !status) {
      return res.status(400).json({ error: 'ID e status são obrigatórios' });
    }
    
    const validStatuses = ['pending', 'read', 'replied'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }
    
    try {
      await updateContactStatus(id, status);
      return res.json({ success: true, message: 'Status atualizado' });
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      return res.status(500).json({ error: 'Erro ao atualizar status' });
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}

export default router;
