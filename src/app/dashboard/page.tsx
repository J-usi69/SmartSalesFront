export default function WelcomePage() {
    return (
      <div className="p-8">
        <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6 border border-primary">
          <h1 className="text-2xl font-semibold text-primary mb-2">¡Bienvenido a tu sistema de gestión!</h1>
          <p className="text-muted-foreground text-sm">
            Desde este panel puedes gestionar usuarios, productos, reportes de ventas y todo lo necesario para mantener tu ecommerce organizado. <br />
            Usa el menú lateral para navegar entre los diferentes módulos.
          </p>
        </div>
      </div>
    );
  }
  