import api from "@/api/axios";

export interface GeneralReport {
  totalUsers: number;
  totalCourses: number;
  totalStudents: number;
  totalCivilServants: number;
  totalEnrollments: number;
  totalCampus: number;
  totalRemainingSpots: number;
}

export async function GetGeneralReport(): Promise<GeneralReport> {
  const response = await api.get<GeneralReport>("reports/general");
  return response.data;
}
export interface CourseStatusReport {
  status: "UNDER_REVIEW" | "IN_PROGRESS" | "COMPLETED" | "CLOSED";
  total: number;
}

export async function GetCoursesByStatusReport(): Promise<CourseStatusReport[]> {
  const response = await api.get<CourseStatusReport[]>("reports/courses/status");
  return response.data;
}
