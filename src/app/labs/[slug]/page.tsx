import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LabDetailView } from "@/components/labs/lab-detail-view";
import { LABS, getLabBySlug } from "@/lib/labs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return LABS.map((lab) => ({ slug: lab.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lab = getLabBySlug(slug);

  if (!lab) {
    return { title: "Lab not found" };
  }

  return {
    title: `${lab.title} | Labs`,
    description: lab.summary,
  };
}

export default async function LabDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const lab = getLabBySlug(slug);

  if (!lab) {
    notFound();
  }

  return <LabDetailView lab={lab} />;
}
