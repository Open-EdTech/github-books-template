import {Waypoint} from 'react-waypoint'
import {useSideBarHeading} from './SideBar/SideBarContext'
// This component is not in use. Failure for context to work.
export type SmartHeadingProps = {
  depth: number;
  slug: string;
  title: string;
  headingIndex: number;
};

const HeadingWrapper: React.FC<{ depth: number, slug: string }> = ({ depth, slug, children }) => {
  if (depth == 2) {
    return <h2 id={slug}>{children}</h2>;
  } else {
    return <h3 id={slug}>{children}</h3>;
  }
};

export default function SmartHeading({
  depth,
  slug,
  title,
  headingIndex,
}: SmartHeadingProps) {
  const setSideBarHeading = useSideBarHeading()[1]
  const lol = useSideBarHeading()[0]
  return (
    <>
    <span className="relative">
      <span className="absolute -my-2">
      <Waypoint 
      onLeave={({currentPosition})=>{
        if(currentPosition === "above") {
          setSideBarHeading(headingIndex)
        }
      }}
      />
      </span>
    </span>
      <HeadingWrapper slug={slug} depth={depth}>{title}</HeadingWrapper>
    </>
  );
}
