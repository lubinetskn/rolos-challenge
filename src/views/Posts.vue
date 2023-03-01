<script lang="ts" setup>
  import { getPosts, Post } from '@/api/api';
  import { onBeforeMount,computed, ref, watch } from 'vue';

  const posts = ref<Post[]>();
  const total = ref<number>(0);

  const limit = 5;
  const currentPage = ref(1);

  const skip = computed(() => 
     limit*(currentPage.value-1)
  );

  const pages = computed(() => {
    const pageCount = Math.ceil(total.value / limit);
    const pagesArray = [];

    const leftGap = 2;
    const rightGap = 2;
    const separator = '...';
    const currentPageNum = currentPage.value;

    if (pageCount<limit + leftGap) {

      for (let i = 1; i <= pageCount; i++) {
        pagesArray.push(i);
      }

    } else if(currentPageNum < limit + leftGap) {

      for (let i = 1; i <= currentPageNum + leftGap; i++) {
        pagesArray.push(i);
      }

      pagesArray.push(separator);

      for (let j = pageCount - (rightGap - 1) ; j <= pageCount; j++) {
        pagesArray.push(j);
      }

    } else if((currentPageNum >= limit + leftGap) && (currentPageNum < pageCount - limit)) {

      for (let k = 1 ; k <= leftGap; k++) {
        pagesArray.push(k);
      }

      pagesArray.push(separator);

      for (let i = currentPageNum - leftGap; i <= currentPageNum + rightGap; i++) {
        pagesArray.push(i);
      }

      pagesArray.push(separator);

      for (let j = pageCount - (rightGap - 1) ; j <= pageCount; j++) {
        pagesArray.push(j);
      }

    } else if(currentPageNum >= pageCount - limit ) {

      for (let k = 1 ; k <= leftGap; k++) {
        pagesArray.push(k);
      }

      pagesArray.push(separator);

      for (let j = currentPageNum - rightGap; j <= pageCount; j++) {
        pagesArray.push(j);
      }
    }

    return pagesArray;
  });

  watch(currentPage, () => {
    loadPosts();
  });

  onBeforeMount(() => loadPosts());

  async function loadPosts() {
    const res = await getPosts(
      limit,
      skip.value
    );
    posts.value = res.posts;
    total.value = res.total;
  }
</script>

<template>
  <h1 class="page-title">Posts list</h1>
  <div>
      <ul class="page-list">
        <li v-for="page in pages" :key="page" :class="{ active: page === currentPage, disable: page ==='...' }">
          <a @click.prevent="()=> currentPage = Number(page)" href="#">
            {{ page }}
          </a>
        </li>
      </ul>
      <div>
        <RouterLink 
          class="post"
          v-for="(post, index) in posts" 
          :to="{ name: 'post', params: { postId: post.id } }"
          :key="index">
            <div class="post__id">#{{ post.id }}</div>
            <div class="post__title">{{ post.title }}</div>
            <div>{{ post.body }}</div>
        </RouterLink>
      </div>
    </div>
</template>

<style scoped>
  .page-title{
    font-size: 2em;
    margin: 12px 0 20px;
  }

  .page-list {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0 0 20px;
    flex-wrap: wrap;
  }
  
  .page-list li {
    margin-right: 7px;
    font-size: 20px;
  }
  
  .active a {
    pointer-events: none;
    color: red;
  }
  
  li a {
    text-decoration: none;
    cursor: pointer;
  }

  .disable{
    pointer-events: none;
  }

  .post {
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-template-rows: repeat(2, auto);
    gap: 8px;

    & + & {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #ccc;
    }

    &__id {
      grid-row: -1/1;
    }

    &__title {
      font-weight: 700;
    }
  }
</style>
