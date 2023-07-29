# 手动处理
通过将配置项manual设置为true，SDK将不会自动上报数据，会触发[beforeSendData](/guide/use/lifecycle#beforesenddata)生命周期，但不会触发afterSendData生命周期

如果你先自行处理这些数据，可以在beforeSendData生命周期中拿到上报数据的分类，和具体数据。然后编写正常的处理逻辑即可。