import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Instagram, MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import Header from "@/components/Header";
import { BRANDS } from "@/lib/brands";

export const metadata: Metadata = {
  title: "Política de Tratamiento de Datos Personales | Valm Beauty",
  description:
    "Política de Tratamiento de Datos Personales de Valm Beauty en cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia (Habeas Data).",
};

const company = {
  legalName: process.env.COMPANY_LEGAL_NAME ?? "Valm Beauty",
  nit: process.env.COMPANY_NIT ?? "[NIT pendiente]",
  address:
    process.env.COMPANY_ADDRESS ?? "Cra 23A # 60-11, Manizales, Caldas, Colombia",
  phone: process.env.COMPANY_PHONE ?? "310 407 7106",
  email: process.env.COMPANY_CONTACT_EMAIL ?? "contacto@valmbeauty.com",
  effectiveDate: process.env.POLICY_EFFECTIVE_DATE ?? "2026-04-14",
};

const sections: { id: string; title: string }[] = [
  { id: "responsable", title: "1. Identificación del responsable" },
  { id: "marco-legal", title: "2. Marco legal" },
  { id: "definiciones", title: "3. Definiciones" },
  { id: "datos", title: "4. Datos personales que se recolectan" },
  { id: "finalidades", title: "5. Finalidades del tratamiento" },
  { id: "autorizacion", title: "6. Autorización del titular" },
  { id: "derechos", title: "7. Derechos del titular" },
  { id: "procedimientos", title: "8. Procedimientos para ejercer los derechos" },
  { id: "terceros", title: "9. Transferencia y transmisión a terceros" },
  { id: "seguridad", title: "10. Seguridad de la información" },
  { id: "menores", title: "11. Tratamiento de datos de menores de edad" },
  { id: "cookies", title: "12. Cookies y tecnologías similares" },
  { id: "conservacion", title: "13. Conservación de los datos" },
  { id: "modificaciones", title: "14. Modificaciones a la política" },
  { id: "autoridad", title: "15. Autoridad de control" },
  { id: "vigencia", title: "16. Vigencia" },
];

export default function PoliticaDatosPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#FDF2F4] to-white px-4 py-14 sm:py-20 border-b border-[#F6BCCB]/30">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[#E93B3C] text-xs font-bold tracking-widest uppercase mb-4">
            Habeas Data · Ley 1581 de 2012
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Política de Tratamiento de Datos Personales
          </h1>
          <p className="mt-5 text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            En {company.legalName} protegemos tu información personal y respetamos
            tu derecho fundamental al habeas data. Aquí te contamos con
            transparencia cómo recolectamos, usamos y cuidamos tus datos.
          </p>
          <p className="mt-4 text-gray-400 text-sm">
            Última actualización: {company.effectiveDate}
          </p>
        </div>
      </section>

      {/* Main content */}
      <main className="mx-auto max-w-4xl px-4 py-14 sm:py-16">
        {/* Índice */}
        <nav
          aria-label="Índice de contenidos"
          className="mb-12 rounded-2xl border border-[#F6BCCB]/40 bg-[#FDF2F4]/40 p-6 sm:p-8"
        >
          <h2 className="text-gray-900 font-bold text-sm tracking-wide uppercase mb-4">
            Contenido
          </h2>
          <ol className="grid gap-2 sm:grid-cols-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-gray-600 text-sm hover:text-[#E93B3C] transition-colors"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-12 text-gray-700 leading-relaxed">
          <section id="responsable" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Identificación del responsable del tratamiento
            </h2>
            <p className="mb-4">
              El responsable del tratamiento de los datos personales recolectados
              a través de este sitio web y de los canales comerciales asociados
              es:
            </p>
            <div className="rounded-xl bg-[#FDF2F4]/60 border border-[#F6BCCB]/40 p-5 sm:p-6 space-y-2 text-sm sm:text-base">
              <p>
                <strong className="text-gray-900">Razón social:</strong>{" "}
                {company.legalName}
              </p>
              <p>
                <strong className="text-gray-900">NIT:</strong> {company.nit}
              </p>
              <p className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 shrink-0 text-[#E93B3C]" />
                <span>
                  <strong className="text-gray-900">Dirección:</strong>{" "}
                  {company.address}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-[#E93B3C]" />
                <span>
                  <strong className="text-gray-900">Teléfono:</strong>{" "}
                  {company.phone}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-[#E93B3C]" />
                <span>
                  <strong className="text-gray-900">
                    Correo de contacto:
                  </strong>{" "}
                  <a
                    href={`mailto:${company.email}`}
                    className="text-[#E93B3C] hover:underline"
                  >
                    {company.email}
                  </a>
                </span>
              </p>
            </div>
          </section>

          <section id="marco-legal" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Marco legal
            </h2>
            <p className="mb-3">
              Esta política se adopta en cumplimiento de la normativa
              colombiana en materia de protección de datos personales, en
              particular:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Constitución Política de Colombia</strong>, artículo 15
                — derecho fundamental al habeas data y a la intimidad.
              </li>
              <li>
                <strong>Ley 1581 de 2012</strong> — régimen general de
                protección de datos personales.
              </li>
              <li>
                <strong>Decreto 1377 de 2013</strong> — reglamenta
                parcialmente la Ley 1581 de 2012.
              </li>
              <li>
                <strong>Ley 1266 de 2008</strong> — habeas data financiero,
                crediticio y comercial (aplica únicamente cuando exista
                tratamiento de información financiera o crediticia).
              </li>
              <li>
                <strong>Decreto 1074 de 2015</strong> (Título V del Libro 2,
                Parte 2) — Decreto Único Reglamentario del sector Comercio,
                Industria y Turismo, que compila las normas reglamentarias en
                materia de protección de datos personales, incluido el Registro
                Nacional de Bases de Datos (RNBD).
              </li>
              <li>
                Circulares y lineamientos de la{" "}
                <strong>
                  Superintendencia de Industria y Comercio (SIC)
                </strong>
                .
              </li>
            </ul>
          </section>

          <section id="definiciones" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Definiciones
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="font-semibold text-gray-900">Titular:</dt>
                <dd>
                  Persona natural cuyos datos personales son objeto de
                  tratamiento.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900">Dato personal:</dt>
                <dd>
                  Cualquier información vinculada o que pueda asociarse a una o
                  varias personas naturales determinadas o determinables.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900">Dato sensible:</dt>
                <dd>
                  Según el artículo 5 de la Ley 1581 de 2012, aquel que afecta
                  la intimidad del titular o cuyo uso indebido puede generar
                  discriminación. En particular: datos que revelen origen racial
                  o étnico, orientación política, convicciones religiosas o
                  filosóficas, pertenencia a sindicatos, organizaciones
                  sociales o de derechos humanos, datos relativos a la salud,
                  a la vida sexual y los datos biométricos.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900">Tratamiento:</dt>
                <dd>
                  Cualquier operación sobre datos personales: recolección,
                  almacenamiento, uso, circulación o supresión.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900">
                  Responsable del tratamiento:
                </dt>
                <dd>
                  {company.legalName}, quien decide sobre la base de datos y
                  su tratamiento.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900">
                  Encargado del tratamiento:
                </dt>
                <dd>
                  Persona natural o jurídica que realiza el tratamiento por
                  cuenta del responsable (por ejemplo, proveedores de hosting,
                  pasarelas de pago o transportadoras).
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900">Autorización:</dt>
                <dd>
                  Consentimiento previo, expreso e informado del titular para
                  el tratamiento de sus datos personales.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900">
                  Aviso de privacidad:
                </dt>
                <dd>
                  Comunicación por la cual se informa al titular sobre la
                  existencia y forma de acceder a esta política.
                </dd>
              </div>
            </dl>
          </section>

          <section id="datos" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Datos personales que se recolectan
            </h2>
            <p className="mb-3">
              Dependiendo de tu interacción con el sitio, {company.legalName}{" "}
              puede recolectar las siguientes categorías de datos:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Datos de identificación:</strong> nombres y apellidos,
                tipo y número de documento de identidad.
              </li>
              <li>
                <strong>Datos de contacto:</strong> correo electrónico, número
                de teléfono celular o fijo.
              </li>
              <li>
                <strong>Datos de ubicación:</strong> dirección de envío, ciudad,
                departamento, código postal y referencias de entrega.
              </li>
              <li>
                <strong>Datos transaccionales y de pago:</strong> productos
                adquiridos, historial de pedidos, monto, medio de pago y
                confirmación de la transacción. Los datos financieros completos
                (número de tarjeta, CVV) son procesados directamente por las
                pasarelas de pago autorizadas y no son almacenados por
                {" "}
                {company.legalName}.
              </li>
              <li>
                <strong>Datos de navegación:</strong> dirección IP, tipo de
                dispositivo, navegador, páginas visitadas, tiempo de
                permanencia y cookies.
              </li>
              <li>
                <strong>Datos comerciales:</strong> preferencias de productos,
                reseñas, comentarios y comunicaciones con servicio al cliente.
              </li>
            </ul>
            <p className="mt-4 text-sm text-gray-500">
              {company.legalName} no recolecta datos sensibles salvo que sean
              estrictamente necesarios y cuente con autorización expresa y
              específica del titular.
            </p>
          </section>

          <section id="finalidades" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Finalidades del tratamiento
            </h2>
            <p className="mb-3">
              Los datos personales son tratados para las siguientes finalidades:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Gestionar el registro de usuarios y la operación de la cuenta.
              </li>
              <li>
                Procesar pedidos, emitir facturas y gestionar devoluciones,
                cambios o garantías.
              </li>
              <li>
                Coordinar el envío y la entrega de productos a través de
                operadores logísticos y transportadoras.
              </li>
              <li>
                Procesar pagos a través de pasarelas autorizadas y prevenir el
                fraude.
              </li>
              <li>Brindar atención al cliente y soporte postventa.</li>
              <li>
                Informar sobre el estado de pedidos, cambios en términos y
                actualizaciones del servicio.
              </li>
              <li>
                Enviar comunicaciones comerciales, promociones y novedades,
                siempre que el titular haya dado autorización expresa y
                específica para tal fin.
              </li>
              <li>
                Realizar estudios de mercado, analítica del sitio y mejora de
                la experiencia de compra.
              </li>
              <li>
                Cumplir con obligaciones legales, tributarias y
                jurisdiccionales que requieran compartir información con
                autoridades competentes.
              </li>
              <li>
                Mantener registros contables, administrativos y de trazabilidad
                comercial.
              </li>
            </ul>
          </section>

          <section id="autorizacion" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Autorización del titular
            </h2>
            <p className="mb-3">
              {company.legalName} solicita la autorización previa, expresa e
              informada del titular antes de recolectar sus datos personales.
              La autorización se obtiene por alguno de los siguientes medios:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Casilla de aceptación (checkbox) en el proceso de compra o
                registro.
              </li>
              <li>
                Aceptación expresa al momento de suscribirse a comunicaciones
                comerciales.
              </li>
              <li>
                Diligenciamiento voluntario de formularios de contacto,
                atención al cliente o encuestas.
              </li>
              <li>
                Conductas inequívocas que permitan concluir razonablemente que
                el titular otorgó su consentimiento (por ejemplo, al completar
                una compra después de leer el aviso de privacidad).
              </li>
            </ul>
            <p className="mt-4">
              La entrega de datos es voluntaria, salvo aquellos que sean
              necesarios para la ejecución del contrato de compra (por ejemplo,
              nombre y dirección de envío). En el caso de datos sensibles, el
              titular no está obligado a autorizar su tratamiento y podrá
              abstenerse de hacerlo.
            </p>
          </section>

          <section id="derechos" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Derechos del titular
            </h2>
            <p className="mb-3">
              De acuerdo con el artículo 8 de la Ley 1581 de 2012, como titular
              de los datos personales tienes derecho a:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Conocer, actualizar y rectificar tus datos personales frente a{" "}
                {company.legalName}.
              </li>
              <li>
                Solicitar prueba de la autorización otorgada, salvo cuando
                expresamente se exceptúe como requisito.
              </li>
              <li>
                Ser informado, previa solicitud, del uso que se le ha dado a
                tus datos personales.
              </li>
              <li>
                Presentar ante la Superintendencia de Industria y Comercio
                quejas por infracciones a la Ley 1581 de 2012.
              </li>
              <li>
                Revocar la autorización y/o solicitar la supresión del dato
                cuando en el tratamiento no se respeten los principios,
                derechos y garantías legales.
              </li>
              <li>
                Acceder en forma gratuita a tus datos personales que hayan sido
                objeto de tratamiento.
              </li>
            </ul>
          </section>

          <section id="procedimientos" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Procedimientos para ejercer los derechos
            </h2>
            <p className="mb-3">
              En cumplimiento del literal c) del artículo 13 del Decreto 1377
              de 2013, el <strong>área responsable</strong> de atender las
              peticiones, consultas y reclamos relacionados con el tratamiento
              de datos personales es el{" "}
              <strong>Área de Servicio al Cliente y Protección de Datos</strong>{" "}
              de {company.legalName}. Para ejercer cualquiera de tus derechos,
              puedes presentar una consulta o reclamo a través de los
              siguientes canales:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Correo electrónico:</strong>{" "}
                <a
                  href={`mailto:${company.email}`}
                  className="text-[#E93B3C] hover:underline"
                >
                  {company.email}
                </a>
              </li>
              <li>
                <strong>Dirección física:</strong> {company.address}
              </li>
              <li>
                <strong>Teléfono:</strong> {company.phone}
              </li>
            </ul>
            <p className="mt-4 mb-2 font-semibold text-gray-900">
              Tiempos de respuesta
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Consultas</strong> (artículo 14 Ley 1581): serán
                atendidas en un término máximo de{" "}
                <strong>diez (10) días hábiles</strong> contados a partir de
                la fecha de recibo. Cuando no sea posible atender la consulta
                dentro de este término, se informará al interesado expresando
                los motivos de la demora y señalando la fecha de respuesta, la
                cual no podrá superar los cinco (5) días hábiles siguientes al
                vencimiento del primer término.
              </li>
              <li>
                <strong>Reclamos</strong> (artículo 15 Ley 1581): serán
                atendidos en un término máximo de{" "}
                <strong>quince (15) días hábiles</strong> contados a partir
                del día siguiente a la fecha de su recibo. Cuando no sea
                posible atenderlo dentro de dicho término, se informará al
                interesado los motivos de la demora y la fecha en que se
                atenderá su reclamo, la cual no podrá superar los ocho (8) días
                hábiles siguientes al vencimiento del primer término.
              </li>
            </ul>
            <p className="mt-4">
              La solicitud debe incluir: nombre completo del titular,
              descripción clara y precisa de los hechos, dirección física o
              electrónica de notificación, y documentos que soporten la
              solicitud cuando corresponda.
            </p>
          </section>

          <section id="terceros" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Transferencia y transmisión a terceros
            </h2>
            <p className="mb-3">
              Para cumplir con las finalidades descritas, {company.legalName}{" "}
              puede compartir datos personales con terceros que actúan como
              encargados del tratamiento, bajo obligaciones contractuales de
              confidencialidad y seguridad. Estos terceros incluyen:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Pasarelas de pago</strong> como Mercado Pago y ADDI,
                para procesar transacciones y financiación.
              </li>
              <li>
                <strong>Operadores logísticos y transportadoras</strong>, para
                la entrega de los productos adquiridos.
              </li>
              <li>
                <strong>Proveedores de servicios tecnológicos</strong>
                (hosting, almacenamiento en la nube, correo transaccional,
                analítica), que pueden encontrarse en Colombia o en el
                exterior.
              </li>
              <li>
                <strong>Entidades financieras</strong>, para la verificación y
                conciliación de pagos.
              </li>
              <li>
                <strong>Autoridades competentes</strong>, cuando exista una
                obligación legal de suministrar la información.
              </li>
            </ul>
            <p className="mt-4">
              Cuando la transferencia o transmisión implique el envío de datos
              personales fuera del territorio colombiano, {company.legalName}{" "}
              dará cumplimiento a lo previsto en el artículo 26 de la Ley 1581
              de 2012, transfiriendo datos únicamente a países que proporcionen
              niveles adecuados de protección, o bien obteniendo la
              autorización expresa del titular, o mediante contratos de
              transmisión con garantías equivalentes a las exigidas por la
              normativa colombiana, conforme a los pronunciamientos de la
              Superintendencia de Industria y Comercio.
            </p>
          </section>

          <section id="seguridad" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Seguridad de la información
            </h2>
            <p>
              {company.legalName} implementa medidas técnicas, humanas y
              administrativas razonables para proteger los datos personales
              frente a pérdida, adulteración, consulta o uso no autorizado.
              Entre las medidas se incluyen: cifrado de comunicaciones mediante
              HTTPS/TLS, controles de acceso basados en roles, respaldos
              periódicos, monitoreo de eventos de seguridad y acuerdos de
              confidencialidad con empleados y encargados.
            </p>
          </section>

          <section id="menores" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Tratamiento de datos de menores de edad
            </h2>
            <p>
              De acuerdo con el artículo 7 de la Ley 1581 de 2012 y la
              Sentencia C-748 de 2011 de la Corte Constitucional, el tratamiento
              de datos de niños, niñas y adolescentes está prohibido, salvo
              cuando se trate de datos de naturaleza pública o cuando exista
              una finalidad que responda al interés superior del menor y se
              cuente con la autorización expresa de su representante legal.
              {" "}{company.legalName} no recolecta intencionalmente datos
              personales de menores de edad a través del sitio.
            </p>
          </section>

          <section id="cookies" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Cookies y tecnologías similares
            </h2>
            <p className="mb-3">
              El sitio utiliza cookies y tecnologías similares para mejorar la
              experiencia del usuario, mantener la sesión, recordar preferencias
              y obtener métricas de uso. Los tipos de cookies utilizadas son:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Cookies técnicas:</strong> necesarias para el
                funcionamiento del sitio (carrito, sesión, checkout).
              </li>
              <li>
                <strong>Cookies de preferencias:</strong> recuerdan selecciones
                del usuario (idioma, ubicación, marca preferida).
              </li>
              <li>
                <strong>Cookies analíticas:</strong> permiten entender cómo los
                visitantes interactúan con el sitio, de manera agregada y
                anónima.
              </li>
            </ul>
            <p className="mt-4">
              El titular puede configurar su navegador para rechazar o eliminar
              cookies. Al hacerlo, algunas funcionalidades del sitio pueden
              verse afectadas.
            </p>
          </section>

          <section id="conservacion" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Conservación de los datos
            </h2>
            <p>
              Los datos personales serán conservados durante el tiempo que sea
              necesario para cumplir con las finalidades para las cuales fueron
              recolectados, así como para atender obligaciones legales,
              contables, fiscales y comerciales aplicables. En particular,
              los registros asociados a transacciones comerciales podrán
              conservarse por el término de <strong>diez (10) años</strong>{" "}
              previsto en el artículo 28 de la Ley 962 de 2005 y normas
              concordantes del Código de Comercio para la conservación de
              documentos mercantiles. Una vez cumplidas dichas finalidades y
              vencidos los plazos legales, los datos serán suprimidos o
              anonimizados de forma segura.
            </p>
          </section>

          <section id="modificaciones" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              14. Modificaciones a la política
            </h2>
            <p>
              {company.legalName} se reserva el derecho de modificar esta
              política en cualquier momento. Cualquier cambio sustancial será
              comunicado a los titulares a través del sitio web o de los
              canales de contacto habituales, antes de su entrada en vigor.
            </p>
          </section>

          <section id="autoridad" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              15. Autoridad de control
            </h2>
            <p>
              La <strong>Superintendencia de Industria y Comercio (SIC)</strong>{" "}
              es la autoridad competente para la protección de datos personales
              en Colombia. Si consideras que tus derechos han sido vulnerados,
              puedes presentar una queja ante la SIC, luego de haber agotado el
              trámite de reclamo directo ante {company.legalName}. Sitio
              oficial:{" "}
              <a
                href="https://www.sic.gov.co/tema/proteccion-de-datos-personales"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E93B3C] hover:underline"
              >
                www.sic.gov.co
              </a>
              .
            </p>
          </section>

          <section id="vigencia" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              16. Vigencia
            </h2>
            <p>
              Esta política rige a partir del{" "}
              <strong>{company.effectiveDate}</strong> y las bases de datos
              administradas por {company.legalName} se conservarán por el
              tiempo necesario para el cumplimiento de las finalidades
              descritas, o durante los plazos exigidos por la ley.
            </p>
          </section>
        </div>

        {/* CTA contacto */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-[#FDF2F4] to-[#F6BCCB]/30 border border-[#F6BCCB]/40 p-8 sm:p-10 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            ¿Tienes alguna pregunta sobre tus datos?
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Escríbenos y te responderemos dentro de los tiempos establecidos por
            la Ley 1581 de 2012.
          </p>
          <a
            href={`mailto:${company.email}`}
            className="inline-flex items-center justify-center gap-2 bg-[#E93B3C] text-white px-8 py-3.5 rounded-full font-bold text-sm transition-all hover:scale-[1.03] hover:shadow-xl"
          >
            <Mail size={18} /> {company.email}
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="bg-[#FDF2F4] border-t border-[#F6BCCB]/30 px-4 py-14 sm:py-16"
        role="contentinfo"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4">
                <Image
                  src="/logos/logo.svg"
                  alt="Valm Beauty"
                  width={130}
                  height={44}
                  className="h-9 w-auto object-contain"
                />
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Belleza y cuidado profesional en Manizales. Productos originales
                con envios a todo Colombia.
              </p>
            </div>
            <div>
              <h4 className="text-gray-900 font-bold text-sm mb-4 tracking-wide uppercase">
                Tienda
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/valm-beauty"
                    className="text-gray-500 text-sm hover:text-[#E93B3C] transition-colors"
                  >
                    Valm Beauty
                  </Link>
                </li>
                <li>
                  <Link
                    href="/catalogo"
                    className="text-gray-500 text-sm hover:text-[#E93B3C] transition-colors"
                  >
                    Catalogo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    className="text-gray-500 text-sm hover:text-[#E93B3C] transition-colors"
                  >
                    Mi carrito
                  </Link>
                </li>
                <li>
                  <Link
                    href="/politica-datos"
                    className="text-gray-500 text-sm hover:text-[#E93B3C] transition-colors"
                  >
                    Política de datos
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-bold text-sm mb-4 tracking-wide uppercase">
                Contacto
              </h4>
              <ul className="space-y-2.5 text-gray-500 text-sm">
                <li>310 407 7106</li>
                <li>Cra 23A # 60-11</li>
                <li>Manizales, Caldas</li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-bold text-sm mb-4 tracking-wide uppercase">
                Siguenos
              </h4>
              <div className="flex flex-col gap-2.5">
                <a
                  href={BRANDS["valm-beauty"].instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-500 text-sm hover:text-[#E93B3C] transition-colors"
                >
                  <Instagram size={16} /> @valm_beauty_mzl
                </a>
                <a
                  href="https://wa.me/573104077106"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-500 text-sm hover:text-[#E93B3C] transition-colors"
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#F6BCCB]/30 text-center">
            <p className="text-gray-400 text-xs">
              &copy; {new Date().getFullYear()} {company.legalName}. Todos los
              derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
