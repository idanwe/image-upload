Template.imageUpload.helpers({
  btnText: function () {
    return this.btnText || i18n('uploadImage');
  }
});

Template.imageUpload.events({
  'change .js-upload-image input[type=file]': function (e, t) {
    e.preventDefault();

    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const options = {
      collection: this.collection
    };


    if (this.preview) {
      options.preview = t.$('.image-preview');
    }

    const method = this.disableResize ? 'insertImage' : 'insertAndResizeImage';

    ImagesHelpers[method](file, options, (err, imageDoc) => {
      if (err) {
        return Materialize.toast(err.reason || err.message, 4000);
      }

      this.onUpload(imageDoc);
    });
  }
});
