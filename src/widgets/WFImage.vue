<template>
  <v-image :config="{ ...config, image: image }" v-on="$listeners"> </v-image>
</template>
<script>
export default {
  name: "WFImage",
  props: {
    config: {
      type: Object,
    },
  },
  mounted() {
    this.setImage(this.config.src);
  },
  methods: {
    setImage(src) {
      const image = new window.Image();
      image.src = src;
      image.onload = () => {
        this.image = image;
      };
    },
  },
  data() {
    return {
      image: null,
    };
  },
  watch: {
    "config.src": {
      async handler(newSrc) {
        console.log(newSrc, "newSrc");
        this.setImage(newSrc);
      },
    },
  },
};
</script>
