import { SideBarProvider } from "../components/SideBar/SideBarContext";
import SideBar from "../components/SideBar/SideBar";
import { getMdSource, getAllRoutesInfo } from "github-books";
import renderToString from "next-mdx-remote/render-to-string";
import Link from "next/link";
import hydrate from "next-mdx-remote/hydrate";
import bookConfig from "../bookConfig.json";
import bookPageHeadings from '../bookPageHeadings.json'
import matter from "gray-matter";
import slug from "remark-slug";
import withNextImages from '../remark/withNextImages'


const getProvider = (urlTree) => ({
  component: (props) => (
    <SideBarProvider {...props} config={urlTree.children} />
  ),
});

function Post({ urlTree, mdxSource, ghUrl, treePath, prevNext, headings }) {
  const content = hydrate(mdxSource, { provider: getProvider(urlTree) });
  return (
    <SideBarProvider config={urlTree.children}>
      <SideBar ghUrl={ghUrl} treePath={treePath} headings={headings}>
        <div className="my-5 px-8 pt-5 pb-2 bg-white shadow-md dark:bg-gray-900 rounded-xl max-w-2xl">
          <div className="prose dark:prose-dark">{content}</div>
          <Cards prevNext={prevNext} />
        </div>
      </SideBar>
    </SideBarProvider>
  );
}

export const getStaticProps = async ({ params }) => {
  const allRoutesInfo = getAllRoutesInfo(bookConfig);
  const stringRoute = params.id.join("/");
  const flatNode = allRoutesInfo[stringRoute];
  const { index: nodeIndex, ghUrl, treePath, prev, next, route} = flatNode;

  const headings = bookPageHeadings[route]

  const prevNext = { prev: prev ?? null, next: next ?? null };
  const urlTree = bookConfig[nodeIndex];
  const source = await getMdSource(flatNode, true);
  const { content } = matter(source);
  const mdxSource = await renderToString(content, {
    mdxOptions: {
      remarkPlugins: [slug, withNextImages],
    },
    provider: getProvider(urlTree),
  });
  return {
    props: { urlTree, mdxSource, ghUrl, treePath, prevNext, headings }, // will be passed to the page component as props
  };
};

export const getStaticPaths = async () => {
  const allRoutesInfo = getAllRoutesInfo(bookConfig);
  return {
    paths: Object.keys(allRoutesInfo).map((routeString) => ({
      params: {
        id: routeString.split("/"),
      },
    })),
    fallback: false,
  };
};


function Cards({ prevNext }) {
  return (
    <div className="grid grid-cols-2 gap-1 my-5">
      <div >
        <Card left info={prevNext.prev} />
      </div>
      <div>
        <Card info={prevNext.next} />
      </div>
    </div>
  );
}

function Card({ left, info }) {
  return (
    !!info && (
      <Link href={info.route}>
        <a>
          <div className="p-4 m-2  border rounded-md flex flex-row items-center shadow-lg hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900">
            {left && (
              <div className="dark:text-gray-100 mr-2">
                <Arrow left />
              </div>
            )}
            <div
              className={`${left ? "text-left mr-auto" : "text-right ml-auto"}`}
            >
              <div className="text-gray-600 dark:text-gray-400 text-sm ">
                {left ? "Previous" : "Next"}
              </div>
              <div className="text-black dark:text-gray-100">{info.title}</div>
            </div>
            {!left && (
              <div className="dark:text-gray-100 ml-2">
                <Arrow />
              </div>
            )}
          </div>
        </a>
      </Link>
    )
  );
}

function Arrow({ left }) {
  if (left) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
</svg>
    );
  } else {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
</svg>
    );
  }
}


export default Post;
