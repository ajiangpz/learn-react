import { slug } from "github-slugger";
import { allCoreContent, sortPosts } from "pliny/utils/contentlayer";
import siteMetadata from "@/data/siteMetadata";
import ListLayout from "@/layouts/ListLayoutWithTags";
import { allBlogs } from "contentlayer/generated";
import tagData from "@/app/blog/tag-data.json";
import { genPageMetadata } from "@/app/blog/seo";
import { Metadata } from "next";
import { notFound } from "next/navigation";
const POSTS_PER_PAGE = 5;

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const tag = decodeURI(params.tag);
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
    alternates: {
      canonical: "./",
      types: {
        "application/rss+xml": `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`
      }
    }
  });
}

export const generateStaticParams = async () => {
  const tagCounts = tagData as Record<string, number>;
  const tagKeys = Object.keys(tagCounts);
  const paths = tagKeys.map(tag => ({
    tag: encodeURI(tag)
  }));
  return paths;
};

export default async function TagPage(props: {
  params: Promise<{
    page: string;
    tag: string;
  }>;
}) {
  const params = await props.params;
  const tag = decodeURI(params.tag);
  const pageNumber = parseInt(params.page as string);

  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(" ").join("-").slice(1);
  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs.filter(
        post => post.tags && post.tags.map(t => slug(t)).includes(tag)
      )
    )
  );
  if (filteredPosts.length === 0) {
    return notFound();
  }
  const initialDisplayPosts = filteredPosts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  );
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(filteredPosts.length / POSTS_PER_PAGE),
    currentTag: tag
  };
  return (
    <ListLayout
      posts={filteredPosts}
      title={title}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
    />
  );
}
