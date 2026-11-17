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

export interface UserRow {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  roles: UserRole[];
}

export interface UsersResponse {
  data: UserRow[];
  total: number;
}

export interface UserRole {
  id?: string;
  name: string;
  slug: string;
}

export interface AvailableRole extends UserRole {
  id: string;
  slug: "ALUNO" | "DEPPI" | "ADMIN" | "PROFESSOR";
}

export async function GetRoles(): Promise<AvailableRole[]> {
  const response = await api.get<AvailableRole[]>("/roles");
  return response.data;
}

export async function AssignRole(
  userId: string,
  roleId: string,
): Promise<void> {
  await api.post(`/users/${userId}/roles/${roleId}`);
}

export async function GetGeneralReport(): Promise<GeneralReport> {
  const response = await api.get<GeneralReport>("reports/general");
  return response.data;
}
export interface CourseStatusReport {
  status: "UNDER_REVIEW" | "IN_PROGRESS" | "COMPLETED" | "CLOSED";
  total: number;
}

export async function GetCoursesByStatusReport(): Promise<
  CourseStatusReport[]
> {
  const response = await api.get<CourseStatusReport[]>(
    "reports/courses/status",
  );
  return response.data;
}

export async function GetUsers() {
  const response = await api.get<UsersResponse>("/users");
  return response.data;
}
