export default function main(request, response) {
  response.status(200).json({
    status: 'success',
    message: 'Hello from RYTHM Server on Vercel'
  });
}
