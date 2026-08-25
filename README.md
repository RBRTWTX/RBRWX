# RBR WX

RBR WX is a clean local broadcast weather workstation foundation.

## 0.1.0 architecture

- The application starts with one shared globe and **zero scenes**.
- The Scene Library contains definitions, not running scenes.
- Adding a scene from the Library creates one entry in the **single left Scene pane**.
- The bottom Show/timeline mirrors the exact same ordered scene array.
- Adding a scene immediately queues its core data preloader.
- Scene preloaders use a shared data cache so compatible scenes can reuse provider data.
- The selected scene receives interactive rendering; the requested scenes remain represented by their preload state.
- Present/output, PNG export, hidden map menu, basemap selection and shared map context remain core application services.
- Port-pending weather products are visible in the Library but cannot be added until their real provider/renderer is implemented.

No NEX GEN WX saved scenes or legacy product state are imported into this project.
