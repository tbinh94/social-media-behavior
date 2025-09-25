export interface ApiChartDataPoint {
  label: string;
  count: number;
}
export interface ApiColumn {
  displayName: string; // Tên cột nguyên bản, để hiển thị cho người dùng
  apiKey: string;      // Tên cột đã làm sạch, để dùng khi gọi API
}