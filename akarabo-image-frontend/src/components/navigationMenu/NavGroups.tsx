import { NavItem } from './NavItem';
import type { NavGroup as NavGroupModel } from './navLinks';

export interface NavGroupsProps {
  /** Groups to render. */
  groups: NavGroupModel[];
  /** Called after a link is activated. */
  onNavigate?: () => void;
}

/** Renders every navigation group, skipping empty ones. */
export function NavGroups({ groups, onNavigate }: NavGroupsProps) {
  return (
    <>
      {groups.map((group) => (
        <div key={group.title}>
          <p className="ak-sidebar__group-title">{group.title}</p>
          <ul className="ak-stack ak-gap-1">
            {group.links.map((link) => (
              <li key={link.to}>
                <NavItem link={link} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export default NavGroups;
