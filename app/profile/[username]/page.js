import { redirect } from "next/navigation";

export default async function ProfilePage({ params }) {
  const { username } = await params;
  redirect(`/profile/${username}/wallet`);
}
