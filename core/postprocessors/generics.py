import re

import attr


@attr.s(slots=True)
class Node(object):
    name = attr.ib()
    range = attr.ib(default=None)
    children = attr.ib(default=attr.Factory(list))
    parent = attr.ib(default=None)
    meta = attr.ib(default=attr.Factory(dict))
    nodeSvgShape = attr.ib(default=attr.Factory(dict))

    @property
    def json(self) -> dict:
        return attr.asdict(self)

    @property
    def is_root(self) -> bool:
        return self.name == "Root"

    @property
    def is_unbounded(self) -> bool:
        if self.is_root:
            return True

        (low, high) = self.range

        m = re.match(rf"{low} < .* < {high}", self.name)
        return bool(m)

    def add_child(self, node: "Node"):
        # [TODO] - Do NOT add duplicate nodes to the parent.
        self.children.append(node)
