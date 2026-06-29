import pool from './db';

const deleteUsers = async () => {
    const emails = ['jesusbustosarizmendi0@gmail.com', 'bujesus42@gmail.com'];
    
    try {
        console.log('Conectando a TiDB Cloud para eliminar usuarios...');
        for (const email of emails) {
            const [result]: any = await pool.query('DELETE FROM users WHERE email = ?', [email]);
            if (result.affectedRows > 0) {
                console.log(`✅ Usuario eliminado con éxito: ${email}`);
            } else {
                console.log(`⚠️ El usuario ${email} no se encontró en la base de datos.`);
            }
        }
    } catch (error) {
        console.error('❌ Error al eliminar usuarios:', error);
    } finally {
        console.log('Proceso finalizado.');
        process.exit(0);
    }
};

deleteUsers();
