import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { pedroWerlangData } from '@/data/pedro-werlang';

export default function HomePage() {
  const analysisDate = new Date(pedroWerlangData.meta.timestamp).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <DashboardShell
      data={pedroWerlangData}
      userName="Pedro Werlang"
      analysisDate={analysisDate}
    />
  );
}
