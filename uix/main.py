from kivy.app import App
from kivy.uix.floatlayout import FloatLayout
from kivy.factory import Factory
from kivy.properties import StringProperty, ObjectProperty
from kivy.uix.popup import Popup

import os


class LoadDialog(FloatLayout):
    load = ObjectProperty(None)
    cancel = ObjectProperty(None)
    kind = StringProperty('')


class Root(FloatLayout):
    forecast_file = StringProperty('')
    observation_file = StringProperty('')


    def dismiss_popup(self):
        self._popup.dismiss()

    def show_load(self, text, kind):
        content = LoadDialog(load=self.load, cancel=self.dismiss_popup, kind=kind)
        self._popup = Popup(title="Load file", content=content,
                            size_hint=(0.9, 0.9))
        self._popup.open()

    def load(self, path, filename, kind):
        if kind == 'observation':
            self.observation_file = os.path.join(path, filename[0])
        elif kind == 'forecast':
            self.forecast_file = os.path.join(path, filename[0])

        self.dismiss_popup()


class FileExplorer(App):
    pass


Factory.register('Root', cls=Root)
Factory.register('LoadDialog', cls=LoadDialog)


if __name__ == '__main__':
    FileExplorer().run()
