import bcrypt from 'bcrypt';

async function generateHash() {
    const password = 'Raul-TheAbyss@';
    const saltRounds = 10;
    
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Senha:', password);
    console.log('Hash gerado:', hash);
    
    // Testar o hash
    const isMatch = await bcrypt.compare(password, hash);
    console.log('Verificação:', isMatch ? '✅ Hash válido' : '❌ Hash inválido');
}

generateHash();
