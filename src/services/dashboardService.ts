import api from "@/api/axios";

export interface GeneralReport {
  totalCourses: number;
  totalStudents: number;
  totalCivilServants: number;
  totalEnrollments: number;
}

export async function GetGeneralReport(): Promise<GeneralReport> {
  const response = await api.get<GeneralReport>("reports/general");
  return response.data;
}
