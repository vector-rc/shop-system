<template>
    <tr>
        <!-- <th>{{item.id}}</th> -->
        <td class="code-sold-product">{{ soldProduct.code }}</td>
        <td class="name-sold-product">{{ soldProduct.name }}</td>
        <td class="price-sold-product">S/. {{ soldProduct.priceSale }}</td>
        <td class="control quantity-sold-product">
            <input
                class="input is-upper"
                type="number"
                min="1"
                @click="($event.target as HTMLInputElement).select()"
                placeholder="Cantidad"
                v-model="soldProduct.quantity"
            />
        </td>
        <td class="mount-sold-product">S/. {{ soldProduct.mount }}</td>

        <td class="p-1" style="width: 1rem;">
            <button
                type="button"
                class="button is-danger p-2 m-0"
                @click="emit('quit', (props.product as any).id)"
            >
                <icon size="15">
                    <delete20-filled/>
                </icon>
            </button>
        </td>
    </tr>
</template>

<script setup lang="ts">
import { reactive, watchEffect } from 'vue'
import { Icon } from '@vicons/utils'
import { Delete20Filled } from '@vicons/fluent'

const emit = defineEmits(['quit'])
const props: any = defineProps({ product: Object })

const soldProduct = reactive(props.product)
watchEffect(() => {
  soldProduct.quantity = soldProduct.quantity < 1 ? 1 : soldProduct.quantity
  soldProduct.mount = soldProduct.quantity * soldProduct.priceSale
})

</script>

<style></style>
