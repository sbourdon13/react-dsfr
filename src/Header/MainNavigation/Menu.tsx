"use client";

import React, { memo, forwardRef } from "react";
import type { ReactNode } from "react";
import { symToStr } from "tsafe/symToStr";
import { fr } from "../../fr";
import { cx } from "../../tools/cx";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import type { RegisteredLinkProps } from "../../link";
import { getLink } from "../../link";

export type MenuProps = {
    classes?: Partial<Record<"root" | "list", string>>;
    links: MenuProps.Link[];
};

export namespace MenuProps {
    export type Link = {
        text: ReactNode;
        linkProps: RegisteredLinkProps;
        isActive?: boolean;
    };
}

export const Menu = memo(
    forwardRef<HTMLDivElement, MenuProps & { id: string }>((props, ref) => {
        const { id, classes = {}, links, ...rest } = props;

        assert<Equals<keyof typeof rest, never>>();

        const { Link } = getLink();

        return (
            <div className={cx(fr.cx("fr-menu"), classes.root)} id={id} ref={ref} {...rest}>
                <ul className={cx(fr.cx("fr-menu__list"), classes.list)}>
                    {links.map(({ text, linkProps, isActive = false }, i) => (
                        <li key={i}>
                            <Link
                                {...linkProps}
                                className={cx(fr.cx("fr-nav__link"), linkProps.className)}
                                {...(isActive && { ["aria-current"]: "page" })}
                            >
                                {text}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    })
);

Menu.displayName = symToStr({ Menu });

export default Menu;
