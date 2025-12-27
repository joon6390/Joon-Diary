import { redirect } from "next/navigation";
import { paths } from "@/commons/constants/url";

export default function Home() {
  redirect(paths.diaries.list);
}
