export default async function handler(req: any, res: any) {
    return res.status(200).json({ status: 'OK', message: 'Dossier API running smoothly' });
}
