import attr


@attr.s(slots=True)
class Node(object):
    name = attr.ib()
    children = attr.ib(default=attr.Factory(list))
    meta = attr.ib(default=attr.Factory(dict))

    @property
    def json(self):
        return attr.asdict(self)
