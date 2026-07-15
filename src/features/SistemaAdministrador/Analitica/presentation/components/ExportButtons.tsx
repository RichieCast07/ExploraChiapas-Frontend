import { Download, FileSpreadsheet } from 'lucide-react';

import type { AdminAnalyticsData } from '../../data/models/Analytics';

interface ExportButtonsProps {
  data: AdminAnalyticsData | null;
}

function fileSuffix(data: AdminAnalyticsData): string {
  const region = data.filters.municipality?.replace(/\s+/g, '-').toLowerCase() ?? 'chiapas';
  return `${region}-${data.filters.from.slice(0, 10)}-${data.filters.to.slice(0, 10)}`;
}

function filterLabel(data: AdminAnalyticsData): string {
  return `${data.filters.from.slice(0, 10)} al ${data.filters.to.slice(0, 10)} · ${data.filters.municipality ?? 'Todos los municipios'}`;
}

export function ExportButtons({ data }: ExportButtonsProps) {
  const exportPdf = async () => {
    if (!data) return;

    const [{ jsPDF }, { default: autoTable }] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable'),
    ]);
    const document = new jsPDF({ orientation: 'landscape' });
    document.setFontSize(18);
    document.setTextColor(24, 120, 58);
    document.text('ExploraChiapas · Reporte de Inteligencia Turística', 14, 16);
    document.setFontSize(9);
    document.setTextColor(80, 90, 82);
    document.text(`Periodo y región: ${filterLabel(data)}`, 14, 23);

    autoTable(document, {
      startY: 29,
      head: [['Indicador', 'Valor']],
      body: [
        ['Usuarios', data.summary.totalUsuarios.toLocaleString('es-MX')],
        ['Afluencia de destinos', data.summary.afluenciaDestinos.toLocaleString('es-MX')],
        ['Rutas generadas', data.summary.totalRutas.toLocaleString('es-MX')],
        ['Negocios verificados', data.summary.negociosVerificados.toLocaleString('es-MX')],
        ['Eventos activos', data.summary.totalEventos.toLocaleString('es-MX')],
        ['Reseñas', data.summary.totalResenas.toLocaleString('es-MX')],
      ],
      theme: 'grid',
      headStyles: { fillColor: [24, 120, 58] },
    });

    autoTable(document, {
      startY: (document as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY
        ? (document as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8
        : 75,
      head: [['#', 'Destino', 'Municipio', 'Categoría', 'Visitas', 'Búsquedas', 'Calificación']],
      body: data.topDestinations.map((destination, index) => [
        index + 1,
        destination.name,
        destination.municipality ?? 'Sin municipio',
        destination.category ?? 'Sin categoría',
        destination.visits,
        destination.searches,
        destination.rating.toFixed(1),
      ]),
      theme: 'striped',
      headStyles: { fillColor: [37, 105, 61] },
    });

    if (data.opportunities.length || data.sustainabilityAlerts.length) {
      document.addPage('landscape');
      document.setFontSize(14);
      document.setTextColor(24, 120, 58);
      document.text('Oportunidades y sostenibilidad', 14, 16);
      autoTable(document, {
        startY: 22,
        head: [['Destino con oportunidad', 'Municipio', 'Visitas', 'Calificación', 'Puntaje']],
        body: data.opportunities.map((item) => [item.name, item.municipality ?? 'Sin municipio', item.visits, item.rating.toFixed(1), item.opportunityScore.toFixed(1)]),
        headStyles: { fillColor: [24, 120, 58] },
      });
      autoTable(document, {
        startY: (document as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8,
        head: [['Alerta', 'Municipio', 'Nivel', 'Afluencia', 'Recomendación']],
        body: data.sustainabilityAlerts.map((item) => [item.name, item.municipality ?? 'Sin municipio', item.level, item.visits, item.recommendation]),
        headStyles: { fillColor: [205, 101, 34] },
      });
    }

    document.save(`reporte-turistico-${fileSuffix(data)}.pdf`);
  };

  const exportExcel = async () => {
    if (!data) return;

    const XLSX = await import('xlsx');
    const workbook = XLSX.utils.book_new();
    const summary = [
      { indicador: 'Periodo', valor: filterLabel(data) },
      ...Object.entries(data.summary).map(([indicator, value]) => ({ indicador: indicator, valor: value })),
    ];
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summary), 'Resumen');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.monthly), 'Actividad mensual');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.searchTrends), 'Tendencias');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.topDestinations), 'Ranking destinos');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.municipalityDistribution), 'Municipios');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.visitorSegments), 'Visitantes');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.opportunities), 'Oportunidades');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.sustainabilityAlerts), 'Sostenibilidad');
    XLSX.writeFile(workbook, `reporte-turistico-${fileSuffix(data)}.xlsx`);
  };

  return (
    <div className="analytics-export-actions">
      <button className="ec-button" type="button" onClick={() => void exportPdf()} disabled={!data}><Download size={15} /> PDF</button>
      <button className="ec-button" type="button" onClick={() => void exportExcel()} disabled={!data}><FileSpreadsheet size={15} /> Excel</button>
    </div>
  );
}